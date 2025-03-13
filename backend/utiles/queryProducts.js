class QueryProducts {
    constructor(products, query) {
        this.products = products; // מערך המוצרים שמתקבל מה-DB
        this.query = query; // הפרמטרים שהמשתמש שלח לחיפוש
    }

    // 🔹 סינון לפי קטגוריה
    categoryQuery() {
        if (this.query.category) {
            // כאן אנחנו מסננים את המוצרים ב-JavaScript
            this.products = this.products.filter(c => c.category === this.query.category);
        }
        return this;
    }
    // 📌 MongoDB Query (במקום לבצע את זה ב-JavaScript)
    // const products = await ProductModel.find({ category: req.query.category });

    // 🔹 סינון לפי דירוג (Rating)
    ratingQuery() {
        if (this.query.rating) {
            const minRating = parseInt(this.query.rating);
            // מסנן את המוצרים שנמצאים בטווח הדירוג המבוקש
            this.products = this.products.filter(c => minRating <= c.rating && c.rating < minRating + 1);
        }
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find({ rating: { $gte: req.query.rating, $lt: req.query.rating + 1 } });

    // 🔹 חיפוש לפי שם מוצר
    searchQuery() {
        if (this.query.searchValue) {
            const searchValue = this.query.searchValue.toUpperCase();
            // ממיר את שם המוצר לאותיות גדולות כדי לבצע חיפוש לא תלוי אותיות גדולות/קטנות
            this.products = this.products.filter(p => p.name.toUpperCase().includes(searchValue));
        }
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find({ name: new RegExp(req.query.searchValue, 'i') });

    // 🔹 סינון לפי טווח מחירים
    priceQuery() {
        if (this.query.lowPrice !== undefined && this.query.highPrice !== undefined) {
            // מסנן מוצרים שהמחיר שלהם בין lowPrice ל-highPrice
            this.products = this.products.filter(p => p.price >= this.query.lowPrice && p.price <= this.query.highPrice);
        }
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find({ price: { $gte: req.query.lowPrice, $lte: req.query.highPrice } });

    // 🔹 מיון לפי מחיר
    sortByPrice() {
        if (this.query.sortPrice) {
            // אם `sortPrice` הוא 'low-to-high' אז מסדרים מהמחיר הנמוך לגבוה, אחרת להפך
            this.products.sort((a, b) => 
                this.query.sortPrice === 'low-to-high' ? a.price - b.price : b.price - a.price
            );
        }
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find().sort({ price: req.query.sortPrice === 'low-to-high' ? 1 : -1 });

    // 🔹 דילוג על מוצרים לפי עמודים (Pagination)
    skip() {
        const pageNumber = parseInt(this.query.pageNumber) || 1;
        const skipPage = (pageNumber - 1) * this.query.parPage;
        // חותכים את המערך כך שיתחיל מהאינדקס של העמוד הנכון
        this.products = this.products.slice(skipPage);
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find().skip(skipPage);

    // 🔹 הגבלת כמות התוצאות
    limit() {
        // חותכים את המערך כך שיכיל רק `parPage` מוצרים
        this.products = this.products.slice(0, this.query.parPage);
        return this;
    }
    // 📌 MongoDB Query:
    // const products = await ProductModel.find().limit(req.query.parPage);

    // 🔹 מחזיר את המוצרים המסוננים
    getProducts() {
        return this.products;
    }

    // 🔹 מחזיר את כמות המוצרים שנותרו אחרי הסינון
    countProducts() {
        return this.products.length;
    }
}

export default QueryProducts;
