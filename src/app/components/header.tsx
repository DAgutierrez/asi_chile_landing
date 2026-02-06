'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Menu, Search, X, ChevronDown } from 'lucide-react';
import { getCategories } from '../data/newsdata';
import type { Category } from '../types';




export default function Header(){

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isNewsOpen, setIsNewsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
    }, []);


    const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${categoryName.toLowerCase()}`);
    setIsNewsOpen(false);
    setMobileMenuOpen(false);
    };

    const handleSubcategoryClick = (
    categoryName: string,
    subcategoryId: string,
    subcategoryName: string
    ) => {
    router.push(
      `/category/${categoryName.toLowerCase()}/${subcategoryName.toLowerCase()}/${subcategoryId.toLowerCase()}`
    );
    setIsNewsOpen(false);
    setMobileMenuOpen(false);
    };

    const mainMenuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Noticias', href: '/article', hasDropdown: true },
    { name: 'Sobre Nosotros', href: '/About' },
    { name: 'Contáctanos', href: '/Contact' },
    ];

    return(
        <header 
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled
                ? 'bg-gradient-to-r from-red-700 to-red-900 shadow-md'
                : 'bg-gradient-to-r from-red-700 to-red-900'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4"
                    style={{ height: '150px' }}> 
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                              src="https://grace-services.s3.us-east-1.amazonaws.com/images-landings/alternativa-socialista/logo.jpeg"
                              alt="Alternativa Socialista"
                              width={500}
                              height={48}
                              className="h-12 w-auto"
                            />
                        </Link>
                    </div>
                        
                    {/* Navbar Navigation */}    
                    <nav className="hidden md:flex space-x-8"> 
                        {mainMenuItems.map((item) => item.hasDropdown ? (
                        <div
                            key={item.name}
                            className="relative group"
                            onMouseEnter={() => setIsNewsOpen(true)}
                            onMouseLeave={() => setIsNewsOpen(false)}
                        >
                            <button className="flex items-center text-sm font-medium text-white hover:text-gray-200 transition-colors">
                            {item.name}
                            <ChevronDown size={16} className="ml-1" />
                            </button>

                            {/* Dropdown menu with subcategories */}
                            <div
                            className={`absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                                isNewsOpen
                                ? 'opacity-100 visible transform translate-y-0'
                                : 'opacity-0 invisible transform -translate-y-2'
                            }`}
                            >
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                {categories.map((category) => (
                                <div key={category.id}>
                                    <button
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-red-50"
                                    role="menuitem"
                                    >
                                    {category.name}
                                    </button>

                                    {category.subcategories &&
                                    category.subcategories.length > 0 && (
                                        <div className="pl-4">
                                        {category.subcategories.map((sub) => (
                                            <button
                                            key={sub.id}
                                            onClick={() =>
                                                handleSubcategoryClick(
                                                category.name,
                                                sub.id,
                                                sub.name
                                                )
                                            }
                                            className="block w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900"
                                            role="menuitem"
                                            >
                                            {sub.name}
                                            </button>
                                        ))}
                                        </div>
                                    )}
                                </div>
                                ))}
                            </div>
                            </div>
                        </div>
                        ) : (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                        >
                            {item.name}
                        </Link>
                        ))}
                    </nav>
                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-1 rounded-full hover:bg-red-800 transition-colors text-white"
                            >
                            <Search size={20} />
                        </button>
                        <button
                            className="md:hidden p-1 rounded-full hover:bg-red-800 transition-colors text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                {searchOpen && (
                <div className="py-3 border-t border-red-800 animate-fadeDown">
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar noticias..."
                        className="w-full py-2 px-4 pr-10 rounded-md bg-red-800 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        autoFocus
                    />
                    <Search
                        className="absolute right-3 top-2.5 text-red-200"
                        size={18}
                    />
                    </div>
                </div>
                )}
            </div>
            {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-r from-red-700 to-red-900 border-t border-red-800 animate-fadeDown">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {mainMenuItems.map((item) =>
                    item.hasDropdown ? (
                    <div key={item.name} className="px-3 py-2">
                        <div className="text-base font-medium text-white mb-2">
                            {item.name}
                        </div>
                        <div className="pl-4 space-y-1">
                            {categories.map((category) => (
                            <div key={category.id}>
                                <button
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="block w-full text-left py-2 text-sm text-gray-200 hover:text-white transition-colors"
                                    >
                                    {category.name}
                                </button>
                                {category.subcategories && category.subcategories.length > 0 && (
                                <div className="pl-4">
                                    {category.subcategories.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleSubcategoryClick(category.name, sub.id, sub.name
                                        )}
                                        className="block w-full text-left py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                        {sub.name}
                                    </button>
                                    ))}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-white hover:bg-red-800 rounded-md transition-colors"
                    >
                    {item.name}
                    </Link>
                )
                )}
            </div>
            </div>
        )}
        </header>
    )
}