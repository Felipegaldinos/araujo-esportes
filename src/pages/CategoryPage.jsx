
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid, List, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CategoryPage = ({ category }) => {
  const { getProductsByCategory } = useProducts();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  
  const products = getProductsByCategory(category);

  const categoryTitles = {
    camisas: 'Camisas Esportivas',
    calcados: 'Calçados Esportivos',
    acessorios: 'Acessórios Esportivos',
    bermudas: 'Bermudas Esportivas'
  };

  const categoryDescriptions = {
    camisas: 'Tecnologia e conforto para seus treinos e competições.',
    calcados: 'Performance e estabilidade para cada passo ou pedalada.',
    acessorios: 'Complete seu kit com os melhores acessórios do mercado.',
    bermudas: 'Leveza e flexibilidade para seus movimentos mais intensos.'
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.preco - b.preco;
      case 'price-high':
        return b.preco - a.preco;
      case 'name':
      default:
        return a.nome.localeCompare(b.nome);
    }
  });

  return (
    <div className="min-h-screen py-10 px-4 text-foreground">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {categoryTitles[category] || 'Categoria Esportiva'}
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            {categoryDescriptions[category] || 'Descubra os melhores produtos para o seu esporte.'}
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 mb-10 shadow-lg border border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-6 w-6 text-primary" />
              <span className="text-foreground font-semibold text-lg">
                {products.length} produto{products.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-background border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  <SelectItem value="name" className="hover:bg-accent focus:bg-accent">Nome A-Z</SelectItem>
                  <SelectItem value="price-low" className="hover:bg-accent focus:bg-accent">Menor Preço</SelectItem>
                  <SelectItem value="price-high" className="hover:bg-accent focus:bg-accent">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
              

              <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`text-foreground ${viewMode === 'grid' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`text-foreground ${viewMode === 'list' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.05 }}
            className={`grid gap-8 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1' 
            }`}
          >
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="bg-card rounded-2xl p-12 max-w-lg mx-auto shadow-xl border border-border">
              <ShoppingBag className="h-20 w-20 text-primary/70 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Ops! Nada por aqui ainda.
              </h3>
              <p className="text-muted-foreground text-lg">
                Nossos atletas estão buscando os melhores itens para esta categoria. 
                Volte em breve para conferir as novidades!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
