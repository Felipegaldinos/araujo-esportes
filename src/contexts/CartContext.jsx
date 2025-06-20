
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedSize) => {
    if (product.tamanhos && product.tamanhos.length > 0 && !selectedSize) {
      toast({
        title: "Ops! Tamanho necessário 👕👟",
        description: `Por favor, selecione um tamanho para ${product.nome}.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems(prevItems => {
      const itemIdentifier = selectedSize ? `${product.id}-${selectedSize}` : product.id.toString();
      const existingItem = prevItems.find(item => item.cartId === itemIdentifier);
      
      if (existingItem) {
        toast({
          title: "Quantidade atualizada! 🛍️",
          description: `${product.nome} (Tamanho: ${selectedSize || 'Único'}) já estava no carrinho. Quantidade aumentada!`,
        });
        return prevItems.map(item =>
          item.cartId === itemIdentifier
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        toast({
          title: "Produto adicionado! 🎉",
          description: `${product.nome} (Tamanho: ${selectedSize || 'Único'}) foi adicionado ao carrinho!`,
        });
        return [...prevItems, { ...product, quantidade: 1, tamanhoSelecionado: selectedSize, cartId: itemIdentifier }];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    toast({
      title: "Produto removido 🗑️",
      description: "Item removido do carrinho com sucesso!",
    });
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId
          ? { ...item, quantidade: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Carrinho limpo! 🧹",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';

    let message = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
    
    cartItems.forEach(item => {
      const sizeInfo = item.tamanhoSelecionado ? ` (Tamanho: ${item.tamanhoSelecionado})` : '';
      message += `• ${item.nome}${sizeInfo} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    message += `\n💰 Total: R$ ${getTotalPrice().toFixed(2)}`;
    message += '\n\nPoderia me ajudar com o pedido? Obrigado! 😊';
    
    return encodeURIComponent(message);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    generateWhatsAppMessage,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
