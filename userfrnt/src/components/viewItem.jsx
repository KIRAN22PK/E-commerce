export default function ViewItem({Item}) {
    return (
        <div>
            <h2>{Item.name}</h2>
            <p>Price: ₹ {Item.price}</p>
            <p>Quantity: {Item.quantity}</p>
        </div>
    );
}