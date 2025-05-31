export interface Product {
    productId: number;
    productDetails: {
        Usage: string;
        Categories: string;
        Trim: string;
        Size: string;
        Images: string | string[];
        Color: string;
        Material: string;
        unit_price: number;
        Name: string;
        "Color Group": string;
        UOM: string;
        "Photo Hover": string;
        "Qty per Box": string;
        Collection: string;
        "Coverage (sqft)": string;
        "Size Advanced": string;
    };
}
