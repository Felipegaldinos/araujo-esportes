
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  where
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject as deleteStorageObject } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};

const initialProductsData = [
  {
    nome: "Camisa Esportiva Performance",
    descricao: "Camisa leve e respirável para máximo desempenho.",
    preco: 129.90,
    categoria: "camisas",
    imagem: "https://images.unsplash.com/photo-1552901899-786020002810?w=400&h=400&fit=crop",
    tamanhos: ["PP", "P", "M", "G", "GG"],
    tipo: "camisa",
    estoque: 50,
  },
  {
    nome: "Tênis de Corrida UltraBoost",
    descricao: "Conforto e amortecimento para longas distâncias.",
    preco: 499.90,
    categoria: "calcados",
    imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    tamanhos: ["38", "39", "40", "41", "42", "43", "44"],
    tipo: "calcado",
    estoque: 30,
  },
  {
    nome: "Bermuda de Treino Flex",
    descricao: "Liberdade de movimento e conforto para seus treinos.",
    preco: 99.90,
    categoria: "bermudas",
    imagem: "https://images.unsplash.com/photo-1591130493025-595069105e62?w=400&h=400&fit=crop",
    tamanhos: ["P", "M", "G", "GG", "34", "36", "38", "40", "42", "44"],
    tipo: "bermuda",
    estoque: 40,
  },
  {
    nome: "Mochila Esportiva Adventure",
    descricao: "Mochila espaçosa e resistente para suas aventuras.",
    preco: 229.90,
    categoria: "acessorios",
    imagem: "https://images.unsplash.com/photo-1579391683922-f6758a09550b?w=400&h=400&fit=crop",
    tamanhos: [],
    tipo: "acessorio",
    estoque: 20,
  }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProductSizes = (productType) => {
    switch (productType) {
      case "camisa":
        return ["PP", "P", "M", "G", "GG"];
      case "calcado":
        return ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
      case "bermuda":
        return ["P", "M", "G", "GG", "34", "36", "38", "40", "42", "44"];
      default:
        return [];
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsCollectionRef = collection(firestore, 'products');
      const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty && products.length === 0) {
        await initializeProducts(); 
        const newSnapshot = await getDocs(q); 
        const productsArray = newSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          firebaseId: doc.id
        }));
        setProducts(productsArray);
      } else {
        const productsArray = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          firebaseId: doc.id
        }));
        setProducts(productsArray);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do Firestore:', error);
      toast({
        title: "Erro ao carregar produtos! ❌",
        description: "Ocorreu um erro ao conectar com o banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const listenToProductChangesForAdmin = (callback) => {
    const productsCollectionRef = collection(firestore, 'products');
    const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        firebaseId: doc.id
      }));
      setProducts(productsArray); 
      if (callback) callback(productsArray);
    }, (error) => {
      console.error('Erro na escuta de produtos (admin):', error);
      toast({
        title: "Erro de conexão (Admin)! ❌",
        description: "Não foi possível sincronizar produtos em tempo real.",
        variant: "destructive"
      });
    });
    return unsubscribe;
  };


  const initializeProducts = async () => {
    setIsSubmitting(true);
    try {
      const productsCollectionRef = collection(firestore, 'products');
      const batch = writeBatch(firestore);
      
      initialProductsData.forEach((product) => {
        const newDocRef = doc(productsCollectionRef); 
        batch.set(newDocRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      
      toast({
        title: "Produtos inicializados! 🎉",
        description: "Produtos padrão foram adicionados ao banco de dados.",
      });
    } catch (error) {
      console.error('Erro ao inicializar produtos:', error);
      toast({
        title: "Erro na inicialização! ❌",
        description: "Não foi possível adicionar produtos iniciais.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    try {
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${imageFile.name}`;
      const imageRef = storageRef(storage, fileName);
      
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        title: "Erro no Upload! 🖼️",
        description: `Falha ao enviar imagem: ${error.message}`,
        variant: "destructive",
      });
      throw error; 
    }
  };

  const addProduct = async (product) => {
    setIsSubmitting(true);
    let docRef = null;
    try {
      let imageUrl = product.imagem || null; 
      
      if (product.imagemFile) {
        imageUrl = await uploadImage(product.imagemFile);
        if (!imageUrl) {
          throw new Error("Upload da imagem falhou, URL não recebida.");
        }
      }

      const newProductData = {
        nome: product.nome,
        descricao: product.descricao || "",
        preco: parseFloat(product.preco),
        categoria: product.categoria,
        tipo: product.tipo,
        imagem: imageUrl || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop',
        tamanhos: getProductSizes(product.tipo),
        estoque: parseInt(product.estoque, 10) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const productsCollectionRef = collection(firestore, 'products');
      docRef = await addDoc(productsCollectionRef, newProductData);
      
      const addedProductWithId = { ...newProductData, id: docRef.id, firebaseId: docRef.id, createdAt: new Date(), updatedAt: new Date() };
      setProducts(prevProducts => [addedProductWithId, ...prevProducts].sort((a, b) => b.createdAt - a.createdAt));


      toast({
        title: "Produto adicionado! 🎉",
        description: `${newProductData.nome} foi criado com sucesso.`,
      });

      return addedProductWithId;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      toast({
        title: "Erro ao adicionar produto! ❌",
        description: error.message || "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive"
      });
      throw error; 
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (productId, updatedProduct) => {
    setIsSubmitting(true);
    try {
      let imageUrl = updatedProduct.imagem;
      
      if (updatedProduct.imagemFile) {
        imageUrl = await uploadImage(updatedProduct.imagemFile);
         if (!imageUrl) {
          throw new Error("Upload da imagem falhou, URL não recebida.");
        }
      }

      const productDocRef = doc(firestore, 'products', productId);
      const productDataToUpdate = {
        nome: updatedProduct.nome,
        descricao: updatedProduct.descricao || "",
        preco: parseFloat(updatedProduct.preco),
        categoria: updatedProduct.categoria,
        tipo: updatedProduct.tipo,
        imagem: imageUrl,
        tamanhos: getProductSizes(updatedProduct.tipo),
        estoque: parseInt(updatedProduct.estoque, 10) || 0,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(productDocRef, productDataToUpdate);

      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.firebaseId === productId ? { ...p, ...productDataToUpdate, updatedAt: new Date() } : p
        ).sort((a, b) => b.createdAt - a.createdAt)
      );

      toast({
        title: "Produto atualizado! ✅",
        description: `${productDataToUpdate.nome} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro ao atualizar produto! ❌",
        description: error.message || "Ocorreu um erro ao atualizar o produto. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    setIsSubmitting(true);
    try {
      const productToDelete = products.find(p => p.firebaseId === productId);
      
      if (productToDelete && productToDelete.imagem && productToDelete.imagem.startsWith('https://firebasestorage.googleapis.com')) {
        try {
          const imageHttpUrl = productToDelete.imagem;
          const imageRefFromUrl = storageRef(storage, imageHttpUrl);
          await deleteStorageObject(imageRefFromUrl);
        } catch (storageError) {
          if (storageError.code === 'storage/object-not-found') {
            console.warn(`Imagem não encontrada no Storage para exclusão: ${productToDelete.imagem}`);
          } else {
            console.error("Erro ao excluir imagem do Storage:", storageError);
            toast({
              title: "Erro ao excluir imagem! 🖼️",
              description: "Não foi possível remover a imagem associada ao produto do armazenamento.",
              variant: "destructive"
            });
          }
        }
      }
      
      const productDocRef = doc(firestore, 'products', productId);
      await deleteDoc(productDocRef);

      setProducts(prevProducts => prevProducts.filter(p => p.firebaseId !== productId));

      toast({
        title: "Produto removido! 🗑️",
        description: `${productToDelete?.nome || 'O produto'} foi excluído.`,
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro ao excluir produto! ❌",
        description: error.message || "Ocorreu um erro ao excluir o produto. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.categoria === category);
  };

  const searchProducts = (searchTerm) => {
    if (!searchTerm) return [];
    return products.filter(product =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.descricao && product.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const value = {
    products,
    loading,
    isSubmitting,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getProductSizes,
    fetchProducts,
    listenToProductChangesForAdmin
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
