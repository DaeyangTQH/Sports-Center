import { createId } from "@paralleldrive/cuid2";
import axios from "axios";
import type { Dispatch } from "redux";
import { setBasket } from "../../features/basket/basketSlice.ts";
import type { Basket, BasketItem, BasketTotals } from "../models/Basket.ts";
import type { Product } from "../models/Product.ts";
class BasketService {
    apiUrl = "http://localhost:8081/api/baskets";

    /**
     * Lấy basket từ API server
     * 
     * ASYNC/AWAIT GIẢI THÍCH:
     * - async: Đánh dấu function này là bất đồng bộ (asynchronous) - luôn trả về Promise -> chính vì thế cần await để lấy cái dữ liệu bên trong n ra
     * - await: Chờ đợi axios.get() hoàn thành trước khi tiếp tục
     * - Tại sao cần async/await: axios.get() là Promise, mất thời gian để gửi request và nhận response
     * - Nếu không dùng await: code sẽ chạy tiếp ngay, response chưa có dữ liệu
     * - Nếu dùng await: code dừng lại chờ response, sau đó mới chạy tiếp
     */
    async getBasketFromApi() {
        try {
            // await: Chờ axios gửi GET request đến API và nhận response về
            // axios.get() trả về Promise, await sẽ chờ Promise resolve
            // Nếu không có await: response sẽ là Promise object, không phải dữ liệu thực
            const response = await axios.get<Basket>(`${this.apiUrl}`);
            // Trả về dữ liệu basket từ response
            return response.data;
        } catch (error) {
            throw new Error("failed to fetch basket" + error);
        }
    }

    /**
     * Lấy basket từ localStorage (lưu trữ trên trình duyệt)
     */
    async getBasket() {
        try {
            // localStorage.getItem() là SYNC - chạy ngay, không cần await
            // Trả về string hoặc null
            const basket = localStorage.getItem("basket");
            if (basket) {
                return JSON.parse(basket) as Basket;
            } else {
                throw new Error("failed to fetch basket in local storage");
            }
        } catch (error) {
            throw new Error("failed to fetch basket " + error);
        }
    }

    /**
     * Thêm item vào basket
     * 
     * ASYNC/AWAIT CHAIN:
     * - await this.getCurrentBasket(): Chờ lấy basket hiện tại
     * - await this.createNewBasket(): Chờ tạo basket mới (nếu chưa có)
     * - await this.setBasket(): Chờ lưu basket lên server và localStorage
     */
    async addItemToBasket(item: Product, quantity = 1, dispatch: Dispatch) {
        try {
            // Nếu không có await: basket sẽ là Promise, không phải Basket object
            let basket = await this.getCurrentBasket();
            if (!basket) {
                // await: Chờ tạo basket mới xong
                basket = await this.createNewBasket();
            }
            // mapProductToBasketItem() là SYNC - không cần await
            // Chuyển đổi Product thành BasketItem format
            const itemToAdd = this.mapProductToBasketItem(item);
            // upsertItems() là SYNC - thêm hoặc cập nhật item trong mảng
            basket.items = this.upsertItems(basket.items, itemToAdd, quantity);
            // await: Chờ setBasket() hoàn thành (gửi lên server + lưu localStorage + dispatch Redux)
            await this.setBasket(basket, dispatch);
            // calculateTotals() là SYNC - tính toán ngay lập tức
            const totals = this.calculateTotals(basket);
            return {basket, totals};
        } catch (error) {
            throw new Error("failed to fetch basket " + error);
        }
    }

    /**
     * Xóa item khỏi basket
     */
    async remove(itemId: number, dispatch: Dispatch) {
        // await: Chờ lấy basket hiện tại
        const basket = await this.getCurrentBasket();
        if (basket){
            // findIndex() là SYNC - tìm index của item trong mảng
            const itemIndex = basket.items.findIndex((p: { id: number; }) => p.id === itemId);
            if(itemIndex !== -1){
                // splice() là SYNC - xóa item khỏi mảng ngay lập tức
                basket.items.splice(itemIndex, 1);
                
                // Kiểm tra nếu xóa hết items
                if(basket.items.length === 0){
                    // Xóa localStorage
                    localStorage.removeItem("basket");
                    localStorage.removeItem("items");
                } else {
                    // Nếu còn items, lưu basket đã cập nhật
                    await this.setBasket(basket, dispatch);
                }
            }
        }
    }

    /**
     * Tăng số lượng item trong basket
     */
    async increaseItemQuantity(itemId: number, quantity: number, dispatch: Dispatch) {
        // await: Chờ lấy basket hiện tại
        const basket = await this.getCurrentBasket();
        if(basket){
            // find() là SYNC - tìm item trong mảng
            const item = basket.items.find((i: { id: number; }) => i.id === itemId);
            if(item){
                // Cập nhật quantity - SYNC operation
                item.quantity += quantity;
                // Đảm bảo quantity không nhỏ hơn 1
                if(item.quantity < 1) item.quantity = 1;
                await this.setBasket(basket, dispatch);
            }
        }
    }

    /**
     * Giảm số lượng item trong basket
     */
    async decreaseItemQuantity(itemId: number, quantity: number, dispatch: Dispatch) {
        // await: Chờ lấy basket hiện tại
        const basket = await this.getCurrentBasket();
        if(basket){
            // find() là SYNC - tìm item trong mảng
            const item = basket.items.find((i: { id: number; }) => i.id === itemId);
            if(item && item.quantity > 1){
                item.quantity -= quantity;
                await this.setBasket(basket, dispatch);
            }
        }
    }

    /**
     * Xóa basket khỏi server
     * 
     * ASYNC/AWAIT:
     * - axios.delete() trả về Promise
     * - await: Chờ request DELETE hoàn thành trước khi function kết thúc
     */
    async deleteBasket(basketId: string): Promise<void> {
        try {
            // await: Chờ axios gửi DELETE request và nhận response
            await axios.delete(`${this.apiUrl}/${basketId}`);
        }catch(error) {
            throw new Error("failed to delete basket " + error);
        }
    }

    /**
     * Lưu basket lên server và localStorage
     * 
     * ASYNC/AWAIT CHAIN:
     * 1. await axios.post(): Chờ gửi POST request lên server
     * 2. localStorage.setItem(): SYNC - lưu ngay lập tức (không cần await)
     * 3. dispatch(): SYNC - dispatch Redux action ngay lập tức
     * 
     * Tại sao axios.post() cần await?
     * - Phải đảm bảo server đã nhận và lưu dữ liệu thành công
     * - Nếu không await: có thể localStorage đã lưu nhưng server chưa lưu xong
     */
    async setBasket(basket: Basket, dispatch: Dispatch) {
        try {
            // await: Chờ axios gửi POST request lên server và nhận response
            // Đảm bảo server đã lưu thành công trước khi tiếp tục
            await axios.post<Basket>(this.apiUrl, basket);
            // localStorage.setItem() là SYNC - không cần await
            // Lưu basket vào localStorage của trình duyệt
            localStorage.setItem("basket", JSON.stringify(basket));
            // dispatch() là SYNC - dispatch Redux action ngay lập tức
            // Cập nhật Redux store với basket mới
            dispatch(setBasket(basket));
        } catch (error) {
            throw new Error("failed to set basket " + error);
        }
    }

    /**
     * Lấy basket hiện tại từ localStorage
     * 
     * LƯU Ý: Function này được đánh dấu async nhưng KHÔNG CẦN THIẾT
     * vì localStorage.getItem() và JSON.parse() đều là SYNC
     * Tuy nhiên, có thể giữ async để nhất quán hoặc để có thể thay đổi sau này
     */
    private async getCurrentBasket() {
        // localStorage.getItem() là SYNC - trả về ngay lập tức
        const basket = localStorage.getItem("basket");
        // JSON.parse() là SYNC - parse ngay lập tức
        // Nếu basket tồn tại: parse thành Basket object, nếu không: trả về null
        return basket ? JSON.parse(basket) as Basket : null;
    }

    /**
     * Tạo basket mới
     * 
     * LƯU Ý: Function này được đánh dấu async nhưng KHÔNG CẦN THIẾT
     * vì tất cả operations bên trong đều là SYNC
     * Tuy nhiên, có thể giữ async để nhất quán hoặc để có thể thêm async operations sau này
     */
    private async createNewBasket(): Promise<Basket> {
        try {
            // Tạo object Basket mới - SYNC operation
            const newBasket: Basket = {
                id: createId(),
                items: []
            }
            // localStorage.setItem() là SYNC - lưu ngay lập tức
            localStorage.setItem('basket_id', newBasket.id);
            // Trả về basket mới
            return newBasket;
        } catch (error) {
            throw new Error("failed to create basket " + error);
        }
    }

    private mapProductToBasketItem(item: Product) {
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: 0, // Mặc định quantity = 0, sẽ được set sau
            pictureUrl: item.pictureUrl,
            productBrand: item.productBrand,
            productType: item.productType
        }
    }

    /**
     * Thêm hoặc cập nhật item trong mảng items
     * 
     * SYNC FUNCTION: Không có async/await
     * - Chỉ thao tác với mảng trong memory
     * - find(), push(), cập nhật property đều là SYNC operations
     * 
     * Logic:
     * - Nếu item đã tồn tại: tăng quantity
     * - Nếu item chưa có: thêm mới vào mảng
     */
    private upsertItems(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
        // find() là SYNC - tìm item trong mảng ngay lập tức
        const existingItem = items.find(x => x.id === itemToAdd.id);
        if (existingItem) {
            // Cập nhật quantity của item đã tồn tại - SYNC
            existingItem.quantity += quantity;
        } else {
            // Set quantity cho item mới - SYNC
            itemToAdd.quantity = quantity;
            // push() là SYNC - thêm item vào mảng ngay lập tức
            items.push(itemToAdd);
        }
        return items;
    }

    /**
     * Tính tổng tiền của basket
     * 
     * SYNC FUNCTION: Không có async/await
     * - Chỉ tính toán với dữ liệu đã có sẵn
     * - reduce() là SYNC - duyệt mảng và tính toán ngay lập tức
     */
    private calculateTotals(basket: Basket): BasketTotals {
        // Shipping cost = 0 (miễn phí vận chuyển)
        const shipping = 0;
        // reduce() là SYNC - tính tổng tiền của tất cả items
        // Công thức: (price * quantity) của từng item, cộng dồn lại
        const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
        // Tổng tiền = subtotal + shipping
        const total = subtotal + shipping;
        return {
            shipping,
            subtotal,
            total
        }
    }
}

export default new BasketService();

