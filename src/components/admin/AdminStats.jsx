import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Tag, Warehouse } from 'lucide-react';

const AdminStats = ({ products }) => {
  const stats = [
    {
      title: 'Total de Produtos',
      value: products.length,
      icon: <Package className="h-8 w-8" />,
      color: 'bg-primary'
    },
    {
      title: 'Valor Médio',
      value: `R$ ${products.length > 0 ? (products.reduce((sum, p) => sum + p.preco, 0) / products.length).toFixed(2) : '0.00'}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-green-600' 
    },
    {
      title: 'Categorias',
      value: new Set(products.map(p => p.categoria)).size,
      icon: <Tag className="h-8 w-8" />,
      color: 'bg-purple-600'
    },
    {
      title: 'Estoque Total',
      value: products.reduce((sum, p) => sum + (p.estoque || 0), 0),
      icon: <Warehouse className="h-8 w-8" />,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="bg-card rounded-xl p-6 shadow-lg border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-lg ${stat.color} text-primary-foreground shadow-md`}>
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;