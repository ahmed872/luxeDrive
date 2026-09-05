import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CarCard from '../components/CarCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Cars = () => {
  const {
    getFilteredCars,
    getBrands,
    getYears,
    getFuelTypes,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    t,
    language
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  const filteredCars = getFilteredCars();
  const brands = getBrands();
  const years = getYears();
  const fuelTypes = getFuelTypes();

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handleFilterChange = (key, value) => {
    // Radix Select in this project throws when SelectItem has empty string value.
    // We map our 'all' sentinel values back to empty string to keep context API unchanged.
    const normalized = (val) => (val === 'all' || val === 'all-years' || val === 'all-types' ? '' : val);
    setFilters({ ...filters, [key]: normalized(value) });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      year: '',
      priceRange: [0, 500000],
      fuelType: '',
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.brand || filters.year || filters.fuelType || filters.searchQuery;

  return (
    <div className="min-h-screen pt-20 bg-[#0D1B2A]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white py-16 border-b border-[#E6C200]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4 gradient-text">{t('cars.title')}</h1>
            <p className="text-xl text-[#D9E1E8]">
              {language === 'ar' ? t('cars.heroSub')(filteredCars.length) : t('cars.heroSub')(filteredCars.length)}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-[#111723] rounded-2xl p-6 shadow-lg border border-[#E6C200]/20 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#E6C200]">{t('filters')}</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-[#E6C200]"
                  >
                    {t('clearAll')}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                    {t('search')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B9EB3]" />
                    <Input
                      type="text"
                      placeholder={t('searchCarsPlaceholder')}
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      className="pl-10 bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3] focus:border-[#E6C200]"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                    {t('brand')}
                  </label>
                  <Select
                    value={filters.brand || 'all'}
                    onValueChange={(value) => handleFilterChange('brand', value)}
                  >
                    <SelectTrigger className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8]">
                      <SelectValue placeholder={t('allBrands')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111723] border-[#E6C200]/30">
                      <SelectItem value="all" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('allBrands')}</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand} className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                    {t('year')}
                  </label>
                  <Select
                    value={filters.year || 'all-years'}
                    onValueChange={(value) => handleFilterChange('year', value)}
                  >
                    <SelectTrigger className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8]">
                      <SelectValue placeholder={t('allYears')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111723] border-[#E6C200]/30">
                      <SelectItem value="all-years" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('allYears')}</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                    {t('fuelType')}
                  </label>
                  <Select
                    value={filters.fuelType || 'all-types'}
                    onValueChange={(value) => handleFilterChange('fuelType', value)}
                  >
                    <SelectTrigger className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8]">
                      <SelectValue placeholder={t('allTypes')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111723] border-[#E6C200]/30">
                      <SelectItem value="all-types" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('allTypes')}</SelectItem>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center space-x-2 bg-[#D4AF37] hover:bg-[#E6B800] text-black"
                variant="outline"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t('filters')}</span>
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-[#111723] border border-[#E6C200]/20 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#E6C200]">{t('filters')}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Same filters as desktop */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B9EB3]" />
                    <Input
                      type="text"
                      placeholder={t('searchCarsPlaceholder')}
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={filters.brand || 'all'}
                    onValueChange={(value) => handleFilterChange('brand', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('allBrands')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allBrands')}</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.year || 'all-years'}
                    onValueChange={(value) => handleFilterChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('allYears')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-years">{t('allYears')}</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.fuelType || 'all-types'}
                    onValueChange={(value) => handleFilterChange('fuelType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">{t('allTypes')}</SelectItem>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      {t('clearAllFilters')}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#D9E1E8]">
                {language === 'ar' ? t('cars.showingXofY')(currentCars.length, filteredCars.length) : t('cars.showingXofY')(currentCars.length, filteredCars.length)}
              </p>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-[#111723] border-[#E6C200]/30 text-[#D9E1E8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111723] border-[#E6C200]/30">
                  <SelectItem value="featured" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('sortFeatured')}</SelectItem>
                  <SelectItem value="price-asc" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('sortPriceAsc')}</SelectItem>
                  <SelectItem value="price-desc" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('sortPriceDesc')}</SelectItem>
                  <SelectItem value="year-desc" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('sortYearDesc')}</SelectItem>
                  <SelectItem value="year-asc" className="text-[#D9E1E8] hover:text-[#0D1B2A] focus:bg-[#E6C200] focus:text-[#0D1B2A]">{t('sortYearAsc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cars Grid */}
            {currentCars.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentCars.map((car, index) => (
                    <CarCard key={car.id} car={car} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-[#E6C200]/30 text-[#D9E1E8] hover:bg-[#E6C200] hover:text-[#0D1B2A] disabled:opacity-50"
                    >
                      {t('previous')}
                    </Button>

                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'bg-gradient-to-r from-[#E6C200] to-[#FFD700] text-[#0D1B2A] hover:bg-[#00E0FF]' : 'border-[#E6C200]/30 text-[#D9E1E8] hover:bg-[#E6C200]/20'}
                      >
                        {index + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-[#E6C200]/30 text-[#D9E1E8] hover:bg-[#E6C200] hover:text-[#0D1B2A] disabled:opacity-50"
                    >
                      {t('next')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#F5F5F5] text-lg mb-4">{t('noVehiclesMatch')}</p>
                <Button onClick={clearFilters} className="bg-gradient-to-r from-[#D4AF37] to-[#E6B800] hover:from-[#E6B800] hover:to-[#D4AF37] text-black font-bold">{t('clearAll')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;

