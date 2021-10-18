import { useState } from "react";
import { useQuery } from "react-query";
//Components
import Item from "./Item/Item";
//styles
import { StyledButton, Wrapper } from "./App.styles";
import { Badge, Drawer, Grid, LinearProgress } from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import Cart from "./Cart/Cart";
//types
export type CartItemType = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
    await (await fetch("https://fakestoreapi.com/products")).json();

const App: React.FC = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    const { data, isLoading, error } = useQuery("products", getProducts);
    console.log(data);

    const getTotalItems = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount, 0);

    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems(prev => {
            const isItemInCart = prev.find(item => item.id === clickedItem.id);

            if (isItemInCart) {
                return prev.map(item =>
                    item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
                );
            }
            return [...prev, { ...clickedItem, amount: 1 }];
        });
    };
    const handleRemoveFromCart = (id: number) => {
        setCartItems(prev =>
            prev.reduce((accu, item) => {
                if (item.id === id) {
                    if (item.amount === 1) return accu;
                    return [...accu, { ...item, amount: item.amount - 1 }];
                } else {
                    return [...accu, item];
                }
            }, [] as CartItemType[])
        );

        // const cartArr = [...cartItems];
        // cartArr.map(item => {
        //     if (item.id === id) {
        //         if (item.amount > 1) {
        //             return { ...item, amount: item.amount - 1 };
        //         } else {
        //             return { ...item, amount: 0 };
        //         }
        //     }
        //     return item;
        // });
        // setCartItems(cartArr);
    };

    if (isLoading) return <LinearProgress />;
    if (error) return <div>something went wrong...</div>;
    return (
        <Wrapper>
            <Drawer anchor="right" open={cartIsOpen} onClose={() => setCartIsOpen(false)}>
                <Cart
                    cartItems={cartItems}
                    addToCart={handleAddToCart}
                    removeFromCart={handleRemoveFromCart}
                />
            </Drawer>
            <StyledButton onClick={() => setCartIsOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color="error">
                    <AddShoppingCart />
                </Badge>
            </StyledButton>
            <Grid container spacing={3}>
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default App;
