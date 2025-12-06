import React, { useState, useMemo, useEffect } from "react";
import TestCard from "./TestCard";
import Icons from "../../components/icons";

const getCategoryTheme = (categoryName) => {
  const colorSchemes = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  ];
  const schemeIndex =
    Math.abs(categoryName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colorSchemes.length;
  return colorSchemes[schemeIndex];
};

const Container = ({ list }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    if (searchTerm.trim() || activeCategory !== "ALL") {
      const newExpanded = {};
      filteredList.forEach((category) => {
        if (category.testList.length > 0) newExpanded[category._id] = true;
      });
      setExpandedCategories(newExpanded);
    } else {
      setExpandedCategories({});
    }
  }, [searchTerm, activeCategory]);

  const filteredList = useMemo(() => {
    let result = [...list];

    if (searchTerm.trim()) {
      result = result
        .map((category) => {
          const filteredTests = category.testList.filter(
            (test) =>
              test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              test._id.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return filteredTests.length > 0 ? { ...category, testList: filteredTests } : null;
        })
        .filter(Boolean);
    }

    if (activeCategory !== "ALL") {
      result = result.filter((category) => category.categoryName === activeCategory);
    }

    if (sortConfig.key === "name") {
      result.sort((a, b) =>
        sortConfig.direction === "asc"
          ? a.categoryName.localeCompare(b.categoryName)
          : b.categoryName.localeCompare(a.categoryName)
      );
    } else if (sortConfig.key === "count") {
      result.sort((a, b) =>
        sortConfig.direction === "asc" ? a.testList.length - b.testList.length : b.testList.length - a.testList.length
      );
    }

    return result;
  }, [list, searchTerm, activeCategory, sortConfig]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    list.forEach((category) => {
      if (category.testList.length > 0) allExpanded[category._id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveCategory("ALL");
    setExpandedCategories({});
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Compact Header */}
      <div className="mb-6">
        {/* Desktop: Single row layout */}
        <div className="hidden sm:flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Expand
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Collapse
            </button>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tests or categories..."
                className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <div className="absolute left-2.5 top-2.5 text-gray-400">
                <Icons.Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSort("name")}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            Sort {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "A-Z" : "Z-A")}
          </button>
        </div>

        {/* Mobile: Two rows layout */}
        <div className="sm:hidden space-y-3 mb-4">
          {/* Row 1: Expand/Collapse and Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Expand
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Collapse
              </button>
            </div>
            <button
              onClick={() => handleSort("name")}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Sort
            </button>
          </div>

          {/* Row 2: Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tests or categories..."
              className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <div className="absolute left-2.5 top-2.5 text-gray-400">
              <Icons.Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filter chips and clear button */}
        {(searchTerm || activeCategory !== "ALL") && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                  <Icons.Search className="w-3 h-3" />
                  {searchTerm}
                </span>
              )}
              {activeCategory !== "ALL" && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                  <Icons.Folder className="w-3 h-3" />
                  {activeCategory}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <Icons.Close className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}

        {/* Summary text */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredList.reduce((acc, cat) => acc + cat.testList.length, 0)} tests
          {filteredList.length > 0 && ` in ${filteredList.length} categories`}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icons.EmptyState className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">No tests found</h3>
          {(searchTerm || activeCategory !== "ALL") && (
            <button
              onClick={clearAllFilters}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <Icons.Close className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((category) => {
            const isExpanded = expandedCategories[category._id] || false;
            const theme = getCategoryTheme(category.categoryName);
            const liveTests = category.testList.filter((test) => test.schemaId).length;

            return (
              <div key={category._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg} border ${theme.border}`}
                      >
                        <span className="text-lg">
                          {category.categoryName === "BLOOD" ? "🩸" : category.categoryName === "URINE" ? "🧪" : "📋"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-semibold text-gray-900 truncate">{category.categoryName}</h2>
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            {category.testList.length} tests
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          {liveTests > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {liveTests} live
                            </span>
                          )}
                          {category.testList.length - liveTests > 0 && (
                            <span className="flex items-center gap-1 text-yellow-600">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                              {category.testList.length - liveTests} offline
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Icons.ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 border-t border-gray-100 ${
                    isExpanded ? "max-h-[5000px]" : "max-h-0"
                  } overflow-hidden`}
                >
                  {category.testList.length > 0 ? (
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {category.testList.map((test) => (
                          <TestCard
                            key={test._id}
                            test={{ ...test, categoryId: category._id, schemaId: test.schemaId || null }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No tests in this category</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-center text-xs text-gray-500">
          Total: {list.reduce((acc, cat) => acc + cat.testList.length, 0)} tests •
          {list.reduce((acc, cat) => acc + cat.testList.filter((t) => t.schemaId).length, 0)} live •
          {list.reduce((acc, cat) => acc + cat.testList.filter((t) => !t.schemaId).length, 0)} offline
        </div>
      </div>
    </div>
  );
};

export default Container;
