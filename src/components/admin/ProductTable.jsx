
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Package, Shirt, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductTable = ({ products, onEdit, onDelete, isFormOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isFormOpen ? 0.2 : 0.6 }}
      className="bg-card rounded-xl overflow-hidden shadow-xl border border-border"
    >
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">
          Lista de Produtos ({products.length})
        </h2>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Produto</th>
                <th className="text-left p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Categoria</th>
                <th className="text-left p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Tipo</th>
                <th className="text-left p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Preço</th>
                <th className="text-left p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Estoque</th>
                <th className="text-center p-4 text-muted-foreground font-semibold uppercase text-sm tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.firebaseId || product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.imagem || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop'}
                        alt={product.nome || 'Produto Esportivo'}
                        className="w-16 h-16 object-cover rounded-lg border border-border"
                      />
                      <div>
                        <p className="text-foreground font-medium text-base">{product.nome || 'Nome Indisponível'}</p>
                        <p className="text-muted-foreground text-xs line-clamp-1 max-w-xs">
                          {product.descricao || 'Descrição Indisponível'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full capitalize">
                      {product.categoria || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground capitalize">
                    {product.tipo === "camisa" && <Shirt className="inline mr-1 h-4 w-4 text-primary" />}
                    {product.tipo === "calcado" && <Footprints className="inline mr-1 h-4 w-4 text-primary" />}
                    {product.tipo || 'N/A'}
                  </td>
                  <td className="p-4 text-foreground font-semibold text-base">
                    R$ {typeof product.preco === 'number' ? product.preco.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-4 text-foreground font-medium">
                    {product.estoque !== undefined ? `${product.estoque} unidades` : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:bg-blue-600/10 hover:text-blue-700"
                        title="Editar Produto"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.firebaseId || product.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Excluir Produto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-16 text-center">
          <Package className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Nenhum produto esportivo na lista!
          </h3>
          <p className="text-muted-foreground text-lg">
            Clique em "Adicionar Novo Produto" para começar a montar seu catálogo.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductTable;
