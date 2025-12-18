import { useEffect, useState } from "react";
import type { Product } from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";
import agent from "../../app/api/agent.ts";
import Spinner from "../../app/layout/Spinner.tsx";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, Pagination,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import type {Brand} from "../../app/models/Brand.ts";
import type {Type} from "../../app/models/Type.ts";

export default function Catalog() {
    const sortOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' }
    ]
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrand] = useState<Brand[]>();
    const [types, setType] = useState<Type[]>();
    const [selectedSort, setSelectedSort] = useState('asc');
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedBrandId, setSelectedBrandId] = useState(0);
    const [selectedTypeId, setSelectedTypeId] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // useEffect(() => {
    //     agent.Store.list()
    //         .then((products) => setProducts(products.content))
    //         .catch(error => console.error(error))
    //         .finally(() => setLoading(false));
    // }, []);
    useEffect(() => {
        Promise.all([
            agent.Store.list(currentPage, pageSize),
            agent.Store.brands(),
            agent.Store.types()
        ]).then(([productsRes, brandsRes, typesRes]) => {
            setProducts(productsRes.content);
            setBrand(brandsRes);
            setType(typesRes);
        })
            .catch(error =>console.error(error))
            .finally(() => setLoading(false));
    }, [currentPage, pageSize]);

    const loadProducts = (selectedSort: string, searchKeyword = '') => {
        setLoading(true);
        let brandId = selectedBrandId != 0 ? selectedBrandId : undefined;
        let typeId = selectedTypeId != 0 ? selectedTypeId : undefined;
        const sort = "name";
        const order = selectedSort === "asc" ? "desc" : "asc";
        let url = `${agent.Store.apiUrl}?sort=${sort}&order=${order}`;
        if(brandId !== undefined || typeId !== undefined){
            url += `&`;
            if(brandId !== undefined){
                url += `brandId=${brandId}&`;
            }
            if(typeId !== undefined){
                url += `typeId=${typeId}&`;
            }
            url = url.replace(/&$/,''); // Remove trailing &
        }
        if (searchKeyword){
            console.log(searchKeyword);
            agent.Store.search(searchKeyword)
                .then((productRes) => {
                    setProducts(productRes.content);
                })
                .catch(error => {console.log(error)})
                .finally(() => setLoading(false));
        }else{
            agent.Store.list(page, size, undefined, undefined, url)
                .then((productRes) => {
                    setProducts(productRes.content);
                })
                .catch((error) => {console.log(error)})
                .finally(() => setLoading(false));
        }
    }

    //Trigger loadProducts whenever selectedSort, selectedBrandId, or selectedTypeId changes
    useEffect(() => {
        loadProducts(selectedSort);
    }, [selectedBrandId, selectedTypeId]);

    const handleSortChange = (event: any) => {
        const selectedSort = event.target.value;
        setSelectedSort(selectedSort);
        loadProducts( selectedSort);
    };

    const handleBrandChange = (event: any) => {
        const selectedBrand = event.target.value;
        const brand = brands?.find((b) => b.name === selectedBrand);
        setSelectedBrand(selectedBrand);
        if (brand) {
            setSelectedBrandId(brand ? brand.id : 0);
            loadProducts( selectedSort);
        }
    };

    const handleTypeChange = (event: any) => {
        const selectedType = event.target.value;
        const type = types?.find((t) => t.name === selectedType);
        setSelectedType(selectedType);
        if (type) {
            setSelectedTypeId(type ? type.id : 0);
            loadProducts( selectedSort);
        }
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    }

    if (!products) return <h3>Unable to load Products</h3>
    if (loading) return <Spinner message="Loading Products..." />
    return (
        <Grid container spacing={4} sx={{ p: 4 }}>
            <Grid size={{xs: 12}}>
                <Box mb={2} textAlign={"center"}>
                    <Typography variant={"subtitle1"}>
                        Displaying {(currentPage-1)*pageSize + 1}-{Math.min(currentPage*pageSize, totalItems)} of {totalItems} products
                    </Typography>
                </Box>
                <Box mt={4} display={"flex"} justifyContent={"center"}>
                    <Pagination count={Math.ceil(totalItems/pageSize)} color={"primary"} onChange={handlePageChange} page={currentPage} />
                </Box>
            </Grid>
            <Grid size={{ xs: 3, sm: 6, md: 4 }}>
                <Paper sx={{mb: 2}}>
                    <TextField
                    label="Search products"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            loadProducts(selectedSort, searchTerm);
                        }
                    }}
                    >
                    </TextField>
                </Paper>

                <Paper sx={{mb: 2, p: 2}}>
                    <FormControl variant="outlined">
                        <FormLabel id="sort-by-name-label">Sort by name</FormLabel>
                        <RadioGroup
                            aria-label="brands"
                            name="brands"
                            value={selectedSort}
                            onChange={handleSortChange}
                        >
                            {sortOptions.map(({value, label}) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio/>}
                                    label={label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>

                <Paper sx={{mb: 2, p: 2}}>
                    <FormControl variant="outlined">
                        <FormLabel id="brands-label">Brands</FormLabel>
                        <RadioGroup
                            aria-label="brands"
                            name="brands"
                            value={selectedBrand}
                            onChange={handleBrandChange}
                        >
                            {brands?.map((brand) => (
                                <FormControlLabel
                                    key={brand.id}
                                    name={brand.name}
                                    control={<Radio/>}
                                    label={brand.name}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>

                <Paper sx={{mb: 2, p: 2}}>
                    <FormControl variant="outlined">
                        <FormLabel id="types-label">Types</FormLabel>
                        <RadioGroup
                            aria-label="types"
                            name="types"
                            value={selectedType}
                            onChange={handleTypeChange}
                        >
                            {types?.map((type) => (
                                <FormControlLabel
                                    key={type.id}
                                    name={type.name}
                                    control={<Radio/>}
                                    label={type.name}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid size={{ xs: 9, sm: 6, md: 8 }}>
                <ProductList products={products} />
            </Grid>
        </Grid>
    );
}