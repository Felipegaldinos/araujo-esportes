
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowLeft, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    generateWhatsAppMessage
  } = useCart();

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = '5511999999999'; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-10 px-4 flex items-center justify-center text-foreground">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <div className="bg-card rounded-2xl p-10 md:p-16 max-w-md mx-auto shadow-xl border border-border">
            <ShoppingBag className="h-20 w-20 text-primary/80 mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
              Seu carrinho está vazio
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Adicione seus equipamentos esportivos favoritos e prepare-se para a ação!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-6 text-base"
            >
              <Link to="/">
                Explorar Produtos
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 text-foreground">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Meu Carrinho Esportivo
            </h1>
            <Button
              asChild
              variant="outline"
              className="border-border text-foreground hover:bg-muted hover:text-primary"
            >
              <Link to="/">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.cartId}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border flex flex-col sm:flex-row items-center gap-6"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-28 h-28 object-cover rounded-lg border-2 border-border shadow-md"
                />
                
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold text-xl mb-1">
                    {item.nome}
                  </h3>
                  <p className="text-primary text-sm mb-1 capitalize">
                    {item.categoria} {item.tamanhoSelecionado && `- Tamanho: ${item.tamanhoSelecionado}`}
                  </p>
                  <p className="text-foreground font-bold text-lg">
                    R$ {item.preco.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-background p-2 rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.cartId, item.quantidade - 1)}
                    className="text-foreground hover:bg-muted h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-foreground font-semibold text-lg min-w-[2.5rem] text-center">
                    {item.quantidade}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.cartId, item.quantidade + 1)}
                    className="text-foreground hover:bg-muted h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 w-10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-xl p-8 sticky top-28 shadow-xl border border-border"
            >
              <h2 className="text-3xl font-bold text-foreground mb-8 border-b border-border pb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-muted-foreground">
                    <span className="w-3/4 truncate">{item.nome}{item.tamanhoSelecionado && ` (${item.tamanhoSelecionado})`} x {item.quantidade}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-primary pt-6 mb-8">
                <div className="flex justify-between text-2xl font-extrabold text-foreground">
                  <span>Total</span>
                  <span>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-base py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Finalizar via WhatsApp
                </Button>

                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive py-6 text-base font-semibold"
                  size="lg"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Limpar Carrinho
                </Button>
              </div>
              
              <div className="mt-8 p-4 bg-background rounded-lg text-center border border-border">
                <p className="text-primary text-sm">
                  🏆 Qualidade e performance garantidas em todos os produtos!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
