import CartItem from "../CartItem/CartItem";

//styles
import { Wrapper } from "./Cart.styles";
//types
import { CartItemType } from "../App";

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotalPrice = (cartItems: CartItemType[]) => {
        return cartItems.reduce(
            (ack: number, item: CartItemType) => ack + item.amount * item.price,
            0
        );
    };
    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? <p>no items in cart</p> : null}
            {cartItems.map(item => (
                <CartItem
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                />
            ))}
            <h3>Total ${calculateTotalPrice(cartItems).toFixed(2)}</h3>
        </Wrapper>
    );
};

export default Cart;
