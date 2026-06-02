import React, { useState } from 'react';
import { HPProduct } from '../types';
import { ShoppingCart, Check, ChevronRight, X, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCatalogProps {
  products: HPProduct[];
}

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<HPProduct | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Format currency with thousands separator and Won symbol
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'laptop':
        return '💻';
      case 'monitor':
        return '🖥️';
      case 'printer':
        return '🖨️';
      case 'accessory':
        return '🖱️';
      default:
        return '🛒';
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: HPProduct) => {
    e.stopPropagation();
    if (addedProductIds.includes(product.id)) {
      // Remove from cart
      setAddedProductIds(addedProductIds.filter(id => id !== product.id));
      setCartCount(prev => prev - 1);
    } else {
      // Add to cart
      setAddedProductIds([...addedProductIds, product.id]);
      setCartCount(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Floating Cart Status indicator inside section if any products selected */}
      {cartCount > 0 && (
        <div className="bg-[#CCFF00] text-black p-4 border-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgba(204,255,0,0.3)] max-w-xl mx-auto transform -rotate-1">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 text-[#CCFF00] font-black text-sm font-mono shrink-0">
              {cartCount} UNITS
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">인체공학 완벽 호환 HP 셋업 ({cartCount}개 품목)</p>
              <p className="text-xs font-mono font-bold">
                총액:{' '}
                {formatPrice(
                  products
                    .filter((p) => addedProductIds.includes(p.id))
                    .reduce((sum, p) => sum + p.price, 0)
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-black text-white hover:bg-white hover:text-black text-[11px] font-black uppercase tracking-widest py-2.5 px-5 border-2 border-black transition-all leading-none focus:outline-none shrink-0"
          >
            패키지 견적 발행 //
          </button>
        </div>
      )}

      {/* Grid containing products with alternative rotating brutalist cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const isAdded = addedProductIds.includes(product.id);
          const isRotatedLeft = index % 2 === 0;
          return (
            <motion.div
              key={product.id}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => setSelectedProduct(product)}
              className={`bg-[#0f0f0f] border-4 border-white p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-[4px_4px_0px_#ffffff] hover:shadow-[4px_4px_0px_#CCFF00] hover:border-[#CCFF00] ${
                isRotatedLeft ? 'transform -rotate-1' : 'transform rotate-1'
              }`}
            >
              {/* Product Header & Tag */}
              <div className="relative pb-4">
                {product.tag && (
                  <span className="absolute -top-1 left-0 bg-white text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border border-black">
                    {product.tag}
                  </span>
                )}
                <span className="absolute -top-2 right-0 text-2xl">
                  {getCategoryIcon(product.category)}
                </span>

                {/* Imagery placeholder mimicking clean HP studio photography */}
                <div className="h-44 w-full bg-black rounded-none mt-8 flex items-center justify-center border-2 border-white/20 relative overflow-hidden">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-2 py-0.5">
                    <span className="text-[8px] font-mono font-bold text-[#CCFF00] tracking-widest">HP PREMIUM STUDIO</span>
                  </div>
                  <div className="text-center p-4">
                    <span className="text-4xl block opacity-60 mb-1">{getCategoryIcon(product.category)}</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block font-mono">
                      {product.category} SPEC MODEL
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h4 className="text-base font-black text-white uppercase tracking-tight mt-4 font-sans line-clamp-1">
                  {product.name}
                </h4>

                {/* Specs */}
                <div className="mt-3 space-y-1 bg-black/40 p-2.5 border border-white/10">
                  {product.specs.slice(0, 3).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/70 font-mono">
                      <span className="w-1.5 h-1.5 bg-[#CCFF00] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA Section */}
              <div className="pt-3 border-t-2 border-white/10">
                <div className="flex flex-wrap items-baseline gap-2 mb-4">
                  <span className="text-lg font-black text-[#CCFF00] font-mono">
                    {formatPrice(product.price)}
                  </span>
                  {product.discountRate && (
                    <>
                      <span className="text-[11px] text-white/50 line-through font-mono">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-[10px] font-black text-[#CCFF00] bg-white/10 px-1 py-0.5 font-mono">
                        {product.discountRate}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest py-3 border-2 transition-all leading-none ${
                      isAdded
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-black text-white border-white hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} className="stroke-[3]" />
                        ADDED TO CONFIG //
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={13} />
                        SELECT SETUP
                      </>
                    )}
                  </button>
                  <button className="bg-black text-white hover:bg-[#CCFF00] hover:text-black p-2 px-3 border-2 border-white/30 hover:border-[#CCFF00] transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f0f] border-4 border-[#CCFF00] w-full max-w-xl p-6 md:p-8 relative rounded-none shadow-[0_0_50px_rgba(204,255,0,0.25)]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-white hover:text-black p-1.5 rounded-none border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-black bg-[#CCFF00] px-3 py-1 uppercase tracking-wider font-mono">
                  HP {selectedProduct.category} DESIGN //
                </span>
                {selectedProduct.tag && (
                  <span className="text-[10px] font-black text-white bg-black border border-white px-2 py-0.5 uppercase tracking-wider">
                    {selectedProduct.tag}
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2 font-mono">
                {selectedProduct.name}
              </h3>

              <div className="h-44 w-full bg-black flex items-center justify-center mb-6 border-2 border-white/20">
                <div className="text-center">
                  <span className="text-5xl block mb-2">{getCategoryIcon(selectedProduct.category)}</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-white/50">
                    HP Premium Hardware Studio / ACTIVE
                  </span>
                </div>
              </div>

              <h4 className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest font-mono mb-3 block">
                인체공학 최적화 스펙 리스트_
              </h4>
              <ul className="space-y-2 mb-6 font-mono text-xs">
                {selectedProduct.specs.map((spec, idx) => (
                  <li key={idx} className="flex gap-2 text-white/80 items-start leading-relaxed">
                    <span className="text-[#CCFF00] font-bold mt-0.5">//</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t-2 border-white/10 mb-2">
                <div>
                  <span className="text-[10px] text-white/50 block font-mono uppercase tracking-wider">RECOMMENDED DEAL PRICE</span>
                  <span className="text-xl font-black text-[#CCFF00] font-mono">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className={`text-xs font-black uppercase tracking-widest py-3 px-6 border-2 transition-all ${
                      addedProductIds.includes(selectedProduct.id)
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-black text-white border-white hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00]'
                    }`}
                  >
                    {addedProductIds.includes(selectedProduct.id)
                      ? 'REMOVE CONFIG //'
                      : 'ADD TO WORKSPACE CONFIG'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Package Quote Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f0f] border-4 border-[#CCFF00] w-full max-w-lg p-6 md:p-8 relative rounded-none shadow-[0_0_50px_rgba(204,255,0,0.3)]"
            >
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-black p-1.5 rounded-none border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-[#CCFF00] mb-2">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                  HP DESKFIT SPECIAL ESTIMATE SYSTEM
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-4">
                인체공학 맞춤형 패키지 견적서
              </h3>

              <div className="bg-black p-4 border-2 border-white/20 mb-6 space-y-3 font-mono text-xs">
                {products
                  .filter((p) => addedProductIds.includes(p.id))
                  .map((product) => (
                    <div key={product.id} className="flex justify-between items-center text-white/80">
                      <span className="font-semibold uppercase truncate max-w-[280px]">› {product.name}</span>
                      <span className="font-mono text-[#CCFF00]">{formatPrice(product.price)}</span>
                    </div>
                  ))}
                <div className="border-t-2 border-white/50 pt-3 flex justify-between items-center text-sm font-black">
                  <span className="text-[#CCFF00] uppercase tracking-wider">최종 특별 제안 견적</span>
                  <span className="font-mono text-[#CCFF00] text-lg">
                    {formatPrice(
                      products
                        .filter((p) => addedProductIds.includes(p.id))
                        .reduce((sum, p) => sum + p.price, 0)
                    )}
                  </span>
                </div>
              </div>

              <p className="text-[10.5px] uppercase font-semibold text-white/50 mb-6 leading-relaxed font-mono">
                * 위 견적은 HP Deskfit AI 인체공학 분석 기고를 바탕으로 설계된 전용 특별 패키지 가격입니다. 본 기기 구매 시, HP Smart Support 6개월 프리커넥션 라이선스가 포함됩니다.
              </p>

              <button
                onClick={() => {
                  alert('성공적으로 견적 접수가 완료되었습니다. 등록하신 이메일로 24시간 내 전문 컨설턴트의 1:1 디바이싱 설계서가 발송됩니다!');
                  setIsCheckoutOpen(false);
                }}
                className="w-full bg-[#CCFF00] text-black text-xs font-black uppercase tracking-widest py-4 border-2 border-black hover:bg-white hover:border-[#CCFF00] transition-all leading-none focus:outline-none cursor-pointer transform -rotate-1 shadow-[0_4px_15px_rgba(204,255,0,0.2)]"
              >
                상세 상담 및 특별 혜택 구매 요청_
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
