"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";

export type AddressSuggestion = {
  display_name: string;
  lat: number;
  lng: number;
};

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string, coords: { lat: number; lng: number }) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  minChars?: number;
  debounceMs?: number;
};

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search for an address...",
  id,
  className = "",
  minChars = 2,
  debounceMs = 500,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < minChars) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/geocode/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setHighlightIndex(-1);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
      setLoading(false);
    },
    [minChars]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < minChars) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, debounceMs, minChars, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(suggestion: AddressSuggestion) {
    onChange(suggestion.display_name);
    onSelect?.(suggestion.display_name, { lat: suggestion.lat, lng: suggestion.lng });
    setSuggestions([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : -1));
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]!);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim().length >= minChars && suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="address-suggestions"
        aria-activedescendant={highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Searching…
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-emerald-200 bg-background py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.display_name}-${i}`}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-emerald-50 ${
                i === highlightIndex ? "bg-emerald-100" : ""
              }`}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
