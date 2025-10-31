import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Outlet, NavLink, Navigate } from 'react-router-dom';
import type { CartItem, Product, TherapyService, Variation } from './types';
import { CartItemType } from './types';

import Consultation from './pages/Consultation';
import Store from './pages/Store';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import AllTherapies from './pages/AllTherapies';
import TherapyDetail from './pages/TherapyDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Cart from './pages/Cart';
import Footer from './components/Footer';


// --- Cart Context ---
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Product | TherapyService, variation: Variation, itemType: CartItemType, quantity?: number) => void;
    updateQuantity: (cartItemId: string, newQuantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    totalQuantity: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((item: Product | TherapyService, variation: Variation, itemType: CartItemType, quantity: number = 1) => {
        setCart(prevCart => {
            const cartItemId = `${itemType}_${item.id}_${variation.name.replace(/\s+/g, '_')}`;
            const existingItem = prevCart.find(ci => ci.cartItemId === cartItemId);
            if (existingItem) {
                return prevCart.map(ci =>
                    ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + quantity, totalPrice: (ci.quantity + quantity) * (parseFloat(variation.price) || 0) } : ci
                );
            } else {
                return [...prevCart, {
                    id: item.id,
                    cartItemId,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    selectedVariation: variation,
                    itemType,
                    quantity,
                    totalPrice: quantity * (parseFloat(variation.price) || 0)
                }];
            }
        });
    }, []);

    const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }
        setCart(prevCart => prevCart.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity: newQuantity, totalPrice: newQuantity * (parseFloat(item.selectedVariation.price) || 0) } : item
        ));
    }, []);

    const removeFromCart = useCallback((cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalQuantity, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

// --- Main App Component ---
function App() {
    return (
        <CartProvider>
            <HashRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/consultation" replace />} />
                        <Route path="consultation" element={<Consultation />} />
                        <Route path="store" element={<Store />} />
                        <Route path="store/products" element={<AllProducts />} />
                        <Route path="products/:id" element={<ProductDetail />} />
                        <Route path="store/therapies" element={<AllTherapies />} />
                        <Route path="therapies/:id" element={<TherapyDetail />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="blog/:id" element={<BlogDetail />} />
                        <Route path="cart" element={<Cart />} />
                         <Route path="*" element={<Navigate to="/consultation" replace />} />
                    </Route>
                </Routes>
            </HashRouter>
        </CartProvider>
    );
}
export default App;


// --- Layout Component ---
const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <main className="flex-grow">
               <AnimatedOutlet />
            </main>
            <Footer />
        </div>
    );
};

// --- Animated Outlet for Page Transitions ---
const AnimatedOutlet: React.FC = () => {
    const location = useLocation();
    // Using a simple key and CSS transition for fade effect
    return (
        <div key={location.pathname} className="page-transition">
            <Outlet />
        </div>
    );
};

// --- Header Component ---
const Header: React.FC = () => {
    const { totalQuantity } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const navItems = [
        { path: '/consultation', label: 'Consultations' },
        { path: '/blog', label: 'Blog' },
        { path: '/store', label: 'Store' },
    ];
    
    const baseLinkClass = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform";
    const inactiveLinkClass = "text-gray-600 hover:bg-teal-100 hover:text-primary-teal hover:scale-105";
    const activeLinkClass = "bg-primary-teal text-white shadow-md scale-105";

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/consultation" className="text-2xl font-serif font-bold text-primary-teal-dark">
                            AvignaTattva
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                         <Link to="/cart" aria-label="View shopping cart" className="relative text-gray-600 hover:text-primary-teal transition-colors transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-accent-gold text-xs font-bold text-black" aria-live="polite">{totalQuantity}</span>
                            )}
                        </Link>
                         <div className="md:hidden ml-4">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary-teal" aria-label="Open main menu" aria-expanded={isMenuOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-2">
                             {navItems.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => `block text-center ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};


// --- Utility for scrolling to top on route change ---
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Add this CSS to a style tag in your index.html or a global CSS file for page transitions
const pageTransitionStyles = `
  .page-transition {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = pageTransitionStyles;
document.head.appendChild(styleSheet);