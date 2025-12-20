import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Pagination,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import type { Brand } from "../../app/models/Brand";
import type { Product } from "../../app/models/Product";
import type { Type } from "../../app/models/Type";
import ProductList from "./ProductList";

export default function Catalog() {
  type SortOrder = "asc" | "desc";
  type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
  };

  const pageSize = 10;

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);

  // Params
  const [order, setOrder] = useState<SortOrder>("asc");
  const [brandId, setBrandId] = useState(0);
  const [typeId, setTypeId] = useState(0);

  // Search: input vs applied keyword
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  // Pagination (UI: 1-based, API: 0-based)
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const rangeText = useMemo(() => {
    if (totalItems === 0) return "Displaying 0 of 0 products";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `Displaying ${start}-${end} of ${totalItems} products`;
  }, [page, pageSize, totalItems]);

  // Load filters once
  useEffect(() => {
    Promise.all([agent.Store.brands(), agent.Store.types()])
      .then(([brandsRes, typesRes]) => {
        setBrands(brandsRes);
        setTypes(typesRes);
      })
      .catch(console.error);
  }, []);

  // Load products whenever params change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    agent.Store.list({
      page: page - 1,
      size: pageSize,
      keyword: keyword || undefined,
      brandId: brandId || undefined,
      typeId: typeId || undefined,
      sort: "name",
      order,
    })
      .then((res: PageResponse<Product>) => {
        if (cancelled) return;
        setProducts(res.content ?? []);
        setTotalItems(res.totalElements ?? 0);
        setTotalPages(res.totalPages ?? 0);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, keyword, brandId, typeId, order]);

  const handleApplySearch = () => {
    const nextKeyword = searchInput.trim();
    setPage(1);
    setKeyword(nextKeyword);
  };

  const handleSortChange = (_: unknown, value: string) => {
    setPage(1);
    setOrder(value as SortOrder);
  };

  const handleBrandChange = (_: unknown, value: string) => {
    setPage(1);
    setBrandId(Number(value));
  };

  const handleTypeChange = (_: unknown, value: string) => {
    setPage(1);
    setTypeId(Number(value));
  };

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  if (loading) return <Spinner message="Loading Products..." />;

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      <Grid size={{ xs: 12 }}>
        <Box mb={2} textAlign={"center"}>
          <Typography variant={"subtitle1"}>{rangeText}</Typography>
        </Box>
        <Box mt={2} display={"flex"} justifyContent={"center"}>
          <Pagination
            count={Math.max(totalPages, 1)}
            color={"primary"}
            onChange={handlePageChange}
            page={page}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 3, sm: 6, md: 4 }}>
        <Paper sx={{ mb: 2 }}>
          <TextField
            label="Search products"
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplySearch();
            }}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl variant="outlined">
            <FormLabel id="sort-by-name-label">Sort by name</FormLabel>
            <RadioGroup
              aria-label="sort"
              name="sort"
              value={order}
              onChange={handleSortChange}
            >
              {sortOptions.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl variant="outlined">
            <FormLabel id="brands-label">Brands</FormLabel>
            <RadioGroup
              aria-label="brands"
              name="brands"
              value={String(brandId)}
              onChange={handleBrandChange}
            >
              {brands.map((b) => (
                <FormControlLabel
                  key={b.id}
                  value={String(b.id)}
                  control={<Radio />}
                  label={b.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl variant="outlined">
            <FormLabel id="types-label">Types</FormLabel>
            <RadioGroup
              aria-label="types"
              name="types"
              value={String(typeId)}
              onChange={handleTypeChange}
            >
              {types.map((t) => (
                <FormControlLabel
                  key={t.id}
                  value={String(t.id)}
                  control={<Radio />}
                  label={t.name}
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