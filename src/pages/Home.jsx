
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, ShieldCheck, Award, ChevronRight, Dribbble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const categories = [
    {
      name: 'Camisas Esportivas',
      href: '/camisas',
      image: 'https://images.unsplash.com/photo-1593724133430-C75015218a2e?w=400&h=300&fit=crop',
      description: 'Performance e estilo'
    },
    {
      name: 'Calçados Esportivos',
      href: '/calcados',
      image: 'https://images.unsplash.com/photo-1460353581680-5185aa295f06?w=400&h=300&fit=crop',
      description: 'Conforto e tecnologia'
    },
    {
      name: 'Bermudas Esportivas',
      href: '/bermudas',
      image: 'https://images.unsplash.com/photo-1591130493025-595069105e62?w=400&h=300&fit=crop',
      description: 'Leveza e flexibilidade'
    },
    {
      name: 'Acessórios',
      href: '/acessorios',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      description: 'Complete seu kit'
    }
  ];

  const features = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Equipamentos de Ponta',
      description: 'Tecnologia para seu melhor desempenho.'
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: 'Compra 100% Segura',
      description: 'Seus dados protegidos em todas as etapas.'
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Qualidade Garantida',
      description: 'Os melhores produtos esportivos do mercado.'
    }
  ];

  return (
    <div className="min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-neutral-50 to-stone-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-stone-800 opacity-90"></div>
        <div className="absolute inset-0">
            <img-replace src="https://images.unsplash.com/photo-1552674605-db6ffd5c2504?auto=format&fit=crop&w=1920&q=80" alt="Fundo abstrato com tons de bege e preto e textura sutil" class="w-full h-full object-cover opacity-20 dark:opacity-10" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6">
                <Dribbble className="h-20 w-20 text-primary animate-float"/>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
              Seu Jogo Começa na
              <span className="block text-primary animate-pulse-slow mt-2">
                Araújo Esportes
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Encontre os melhores equipamentos, roupas e calçados esportivos para atingir seus objetivos.
              Qualidade, performance e estilo para atletas como você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-7 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Link to="/camisas">
                  Ver Coleção
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-10 py-7 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Link to="/bermudas">
                  Novidades em Bermudas
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nossas Categorias Esportivas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Equipamentos para todas as modalidades e níveis de performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group"
              >
                <Link to={category.href}>
                  <div className="relative overflow-hidden rounded-2xl bg-card shadow-xl h-80 flex flex-col justify-end border border-border">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="relative p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-neutral-300 mb-3">{category.description}</p>
                      <span className="font-semibold text-amber-400 group-hover:text-amber-300 transition-colors duration-300 flex items-center">
                        Explorar <ChevronRight className="ml-1 h-5 w-5"/>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Destaques da Semana
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os itens mais cobiçados pelos nossos atletas e clientes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-10 py-7"
            >
              <Link to="/bermudas">
                Ver Todas as Bermudas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center bg-card rounded-2xl p-10 shadow-xl border border-border"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full text-primary-foreground mb-8 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
         <div className="container mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center bg-card rounded-3xl p-12 md:p-16 shadow-2xl border border-border"
          >
            <Dribbble className="h-16 w-16 text-primary mx-auto mb-6"/>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              Pronto para Superar Seus Limites?
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Junte-se à comunidade Araújo Esportes e tenha acesso aos melhores produtos para sua jornada esportiva. 
              Qualidade, performance e os melhores preços, tudo em um só lugar!
            </p>
            <div className="flex items-center justify-center gap-2 mb-10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-7 w-7 text-yellow-400 fill-current" />
              ))}
              <span className="text-muted-foreground ml-2 text-lg">4.9/5 - Avaliado por atletas como você!</span>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl px-12 py-8 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Link to="/carrinho">
                Começar Sua Jornada
                <ChevronRight className="ml-2 h-7 w-7" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
