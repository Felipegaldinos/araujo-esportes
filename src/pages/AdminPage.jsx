
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AdminStats from '@/components/admin/AdminStats';
import ProductForm from '@/components/admin/ProductForm';
import ProductTable from '@/components/admin/ProductTable';

const AdminPage = () => {
  const { 
    products: contextProducts, 
    loading: contextLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    isSubmitting,
    listenToProductChangesForAdmin 
  } = useProducts();
  const { currentUser, logout } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminProducts, setAdminProducts] = useState(contextProducts);
  const [adminLoading, setAdminLoading] = useState(contextLoading);
  
  const initialFormData = {
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: '',
    tipo: '',
    estoque: '',
    imagemFile: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setAdminLoading(true);
    const unsubscribe = listenToProductChangesForAdmin((updatedProducts) => {
      setAdminProducts(updatedProducts);
      setAdminLoading(false);
    });
    
    return () => unsubscribe();
  }, [listenToProductChangesForAdmin]);


  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nome: editingProduct.nome || '',
        descricao: editingProduct.descricao || '',
        preco: editingProduct.preco ? editingProduct.preco.toString() : '',
        categoria: editingProduct.categoria || '',
        imagem: editingProduct.imagem || '', 
        tipo: editingProduct.tipo || '',
        estoque: editingProduct.estoque !== undefined ? editingProduct.estoque.toString() : '',
        imagemFile: null, 
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingProduct, isFormOpen]);

  const handleFormSubmit = async (submittedData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.firebaseId, submittedData);
      } else {
        await addProduct(submittedData);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (firebaseId) => {
    try {
      await deleteProduct(firebaseId);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (adminLoading && adminProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 text-foreground">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                Painel do Administrador
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie seus produtos esportivos e impulsione suas vendas.
              </p>
              {currentUser && (
                <p className="text-sm text-muted-foreground mt-2">
                  Logado como: <span className="font-medium">{currentUser.email}</span>
                </p>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isSubmitting}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </motion.div>

        <AdminStats products={adminProducts} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <Button
            onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 py-3 px-6"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting && isFormOpen && !editingProduct ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Plus className="h-5 w-5 mr-2" />
            )}
            Adicionar Novo Produto
          </Button>
        </motion.div>

        {isFormOpen && (
          <ProductForm
            isOpen={isFormOpen}
            onClose={resetForm}
            onSubmit={handleFormSubmit}
            initialData={editingProduct ? formData : initialFormData}
            editingProduct={editingProduct}
            isSubmitting={isSubmitting}
          />
        )}

        <ProductTable
          products={adminProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isFormOpen={isFormOpen}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AdminPage;
