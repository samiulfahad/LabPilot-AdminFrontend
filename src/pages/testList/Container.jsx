import React, { useState, useMemo, useEffect } from "react";
import TestCard from "./TestCard";

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
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Test Catalog</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute left-2.5 top-2.5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSort("name")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
            >
              Sort {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </button>
          </div>

          {(searchTerm || activeCategory !== "ALL") && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Search: {searchTerm}</span>
                )}
                {activeCategory !== "ALL" && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Category: {activeCategory}
                  </span>
                )}
              </div>
              <button onClick={clearAllFilters} className="text-xs text-red-600 hover:text-red-800 font-medium">
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredList.reduce((acc, cat) => acc + cat.testList.length, 0)} tests
          {filteredList.length > 0 && ` in ${filteredList.length} categories`}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">No tests found</h3>
          {(searchTerm || activeCategory !== "ALL") && (
            <button
              onClick={clearAllFilters}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
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
                    <svg
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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
