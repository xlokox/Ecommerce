class QueryProducts {
    constructor(products, query) {
        this.products = products;
        this.query = query;
    }

    categoryQuery() {
        if (this.query.category) {
            this.products = this.products.filter(c => c.category === this.query.category);
        }
        return this;
    }

    ratingQuery() {
        if (this.query.rating) {
            const minRating = parseInt(this.query.rating);
            this.products = this.products.filter(c => minRating <= c.rating && c.rating < minRating + 1);
        }
        return this;
    }

    searchQuery() {
        if (this.query.searchValue) {
            const searchValue = this.query.searchValue.toUpperCase();
            this.products = this.products.filter(p => p.name.toUpperCase().includes(searchValue));
        }
        return this;
    }

    priceQuery() {
        if (this.query.lowPrice !== undefined && this.query.highPrice !== undefined) {
            this.products = this.products.filter(p => p.price >= this.query.lowPrice && p.price <= this.query.highPrice);
        }
        return this;
    }

    sortByPrice() {
        if (this.query.sortPrice) {
            this.products.sort((a, b) => 
                this.query.sortPrice === 'low-to-high' ? a.price - b.price : b.price - a.price
            );
        }
        return this;
    }

    skip() {
        const pageNumber = parseInt(this.query.pageNumber) || 1;
        const skipPage = (pageNumber - 1) * this.query.parPage;
        this.products = this.products.slice(skipPage);
        return this;
    }

    limit() {
        this.products = this.products.slice(0, this.query.parPage);
        return this;
    }

    getProducts() {
        return this.products;
    }

    countProducts() {
        return this.products.length;
    }
}

export default QueryProducts;
