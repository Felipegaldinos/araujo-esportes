
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';

const SearchBar = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { searchProducts } = useProducts();

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchProducts(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
      </div>

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-card backdrop-blur-md rounded-lg p-4 max-h-96 overflow-y-auto border border-border"
        >
          <h3 className="text-foreground font-semibold mb-3">
            Resultados da busca ({searchResults.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </motion.div>
      )}

      {searchTerm && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-muted-foreground"
        >
          Nenhum produto encontrado para "{searchTerm}"
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
