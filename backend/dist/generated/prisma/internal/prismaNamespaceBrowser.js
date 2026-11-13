import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Category: 'Category',
    Product: 'Product',
    Order: 'Order',
    OrderItem: 'OrderItem'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    password: 'password',
    role: 'role',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    image: 'image',
    isActive: 'isActive'
};
export const ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    image: 'image',
    ingredients: 'ingredients',
    price: 'price',
    categoryId: 'categoryId',
    isAvailable: 'isAvailable',
    isFeatured: 'isFeatured',
    isPopular: 'isPopular',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderScalarFieldEnum = {
    id: 'id',
    orderNumber: 'orderNumber',
    userId: 'userId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    deliveryAddress: 'deliveryAddress',
    deliveryInstructions: 'deliveryInstructions',
    subtotal: 'subtotal',
    deliveryFee: 'deliveryFee',
    total: 'total',
    paymentMethod: 'paymentMethod',
    paymentStatus: 'paymentStatus',
    orderStatus: 'orderStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const OrderItemScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    productId: 'productId',
    productName: 'productName',
    productImage: 'productImage',
    unitPrice: 'unitPrice',
    quantity: 'quantity',
    totalPrice: 'totalPrice'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map