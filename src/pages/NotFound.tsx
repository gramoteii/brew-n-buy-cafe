
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-9xl font-serif font-medium text-primary mb-4">404</h1>
        <p className="text-2xl text-foreground mb-8">Страница не найдена</p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link to="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
