// /**
//  * ItemCard — Premium product card with hover effects and smooth transitions
//  * Features glassmorphism, subtle shadows, and responsive design
//  */
// export const ItemCard = ({ product, onSelect = () => {} }) => {
//   const { name, tagline, price, image, colors = [], isNew } = product;

//   return (
//     <article className="group bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col h-full hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
//       <div className="relative rounded-xl overflow-hidden bg-neutral-100 aspect-square mb-5">
//         {isNew && (
//           <span className="absolute top-3 left-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1.5 z-10">
//             New
//           </span>
//         )}
//         <img
//           src={image}
//           alt={name}
//           loading="lazy"
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//       </div>

//       <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
//       <p className="text-sm text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">{tagline}</p>

//       {colors.length > 0 && (
//         <p className="text-sm text-neutral-400 mt-2">
//           {colors.length} color{colors.length > 1 ? "s" : ""}
//         </p>
//       )}

//       <div className="mt-auto pt-5 flex items-center justify-between">
//         <span className="text-lg font-semibold text-neutral-900">${price}</span>
//         <button
//           onClick={() => onSelect(product)}
//           className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-colors duration-200"
//         >
//           Buy
//         </button>
//       </div>
//     </article>
//   );
// };
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/utils";
import { CheckCircle2, Heart, Crown, Tag, Package, Star } from "lucide-react";
import { createContext, useContext } from "react";

const CardHoverRevealContext = createContext();

const CardHoverRevealProvider = ({ children, isHovered, setIsHovered }) => {
  return (
    <CardHoverRevealContext.Provider value={{ isHovered, setIsHovered }}>
      {children}
    </CardHoverRevealContext.Provider>
  );
};

const useCardHoverRevealContext = () => {
  const context = useContext(CardHoverRevealContext);
  if (!context) {
    throw new Error("useCardHoverRevealContext must be used within CardHoverRevealProvider");
  }
  return context;
};

const CardHoverReveal = ({ className, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <CardHoverRevealProvider isHovered={isHovered} setIsHovered={setIsHovered}>
      <div
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </CardHoverRevealProvider>
  );
};

const CardHoverRevealMain = ({ className, initialScale = 1, hoverScale = 1.05, ...props }) => {
  const { isHovered } = useCardHoverRevealContext();
  return (
    <div
      className={cn("size-full transition-transform duration-300", className)}
      style={
        isHovered
          ? { transform: `scale(${hoverScale})`, ...props.style }
          : { transform: `scale(${initialScale})`, ...props.style }
      }
      {...props}
    />
  );
};

const CardHoverRevealContent = ({ className, ...props }) => {
  const { isHovered } = useCardHoverRevealContext();
  return (
    <div
      className={cn(
        "absolute inset-[auto_1.5rem_1.5rem] p-6 backdrop-blur-lg transition-all duration-500 ease-in-out",
        className
      )}
      style={
        isHovered
          ? { translate: "0%", opacity: 1, ...props.style }
          : { translate: "0% 120%", opacity: 0, ...props.style }
      }
      {...props}
    />
  );
};

const Badge = ({ label, variant = "primary", size = "medium", icon, className }) => {
  const variantStyles = {
    primary: "bg-[#2B2B2B]/60 text-[#F7E6CA]",
    success: "bg-[#464646]/60 text-[#F7E6CA]",
    warning: "bg-[#E8D59E] text-[#000000]",
  };

  const sizeStyles = {
    small: "text-xs px-2 py-1",
    medium: "text-sm px-3 py-2",
    large: "text-base px-4 py-3",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl font-medium shadow-lg inline-flex items-center gap-2 backdrop-blur-sm",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </motion.div>
  );
};

export const ItemCard = ({ product, onPurchase = () => {} }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePurchase = () => {
    onPurchase(product);
  };

  return (
    <CardHoverReveal className="h-[500px] rounded-2xl group">
      <CardHoverRevealMain hoverScale={1.03}>
        <div className="relative h-full w-full rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-neutral-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-8"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#2B2B2B]/40 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2 items-center">
              {product.isNew && (
                <CheckCircle2 className="w-5 h-5 text-[#E8D59E]" />
              )}
              {product.featured && (
                <Crown
                  className="w-5 h-5 text-[#E8D59E]"
                  fill="currentColor"
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-[#D4D4D4]/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorite ? "fill-[#E8D59E] text-[#E8D59E]" : "text-[#464646]"
                )}
              />
            </motion.button>
          </div>

          {/* Price badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge
              label={`$${product.price}`}
              variant="primary"
              size="large"
              className="text-lg font-bold"
            />
          </div>
        </div>
      </CardHoverRevealMain>

      <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[#2B2B2B]/90 backdrop-blur-xl border border-[#D4D4D4]/10">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#F7E6CA]">{product.name}</h3>
          <div className="flex items-center gap-2 text-[#B3B3B3]">
            <Tag className="w-4 h-4" />
            <p className="text-sm">{product.category}</p>
          </div>
        </div>

        <div className="flex gap-4 pt-2 border-t border-[#D4D4D4]/10">
          <div className="flex items-center gap-2 text-[#B3B3B3]">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">{product.colors?.length || 1} color{product.colors?.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-[#B3B3B3]">
            <Star className="w-5 h-5 fill-[#E8D59E] text-[#E8D59E]" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePurchase}
          className="w-full bg-[#E8D59E] text-[#000000] py-3 rounded-lg font-semibold shadow-lg hover:bg-[#F7E6CA] transition-colors cursor-pointer"
        >
          Purchase
        </motion.button>
      </CardHoverRevealContent>
    </CardHoverReveal>
  );
};
