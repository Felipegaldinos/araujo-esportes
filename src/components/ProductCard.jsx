import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getProductSizes } = useProducts();
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = () => {
    if (product.tamanhos && product.tamanhos.length > 0 && !selectedSize) {
      toast({
        title: "Escolha um tamanho!",
        description: `Por favor, selecione um tamanho para ${product.nome}.`,
        variant: "destructive",
      });
      return;
    }
    addToCart(product, selectedSize);
    setSelectedSize(''); 
  };
  
  const availableSizes = product.tamanhos && product.tamanhos.length > 0 ? product.tamanhos : getProductSizes(product.tipo);
  const price = typeof product.preco === 'number' ? product.preco : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-card backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-border card-hover flex flex-col justify-between"
    >
      <div>
        <div className="relative group">
          <img
            src={product.imagem || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop'}
            alt={product.nome || 'Produto Esportivo'}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-white/80 opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
          </div>
          
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full capitalize shadow-md">
              {product.categoria || 'Categoria'}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-foreground font-bold text-xl mb-2 line-clamp-1">
            {product.nome || 'Nome do Produto'}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 h-10">
            {product.descricao || 'Descrição não disponível.'}
          </p>

          {availableSizes.length > 0 && (
            <div className="mb-4">
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring">
                  <SelectValue placeholder="Escolha o tamanho" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {availableSizes.map(size => (
                    <SelectItem key={size} value={size} className="hover:bg-accent focus:bg-accent">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold text-foreground">
            R$ {price.toFixed(2)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;