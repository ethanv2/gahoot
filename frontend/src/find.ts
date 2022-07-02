/*
 *  Gahoot! A self-hostable, minimal rewrite of Kahoot! in Go
 *  Copyright 2022 - Ethan Marshall
 *
 *  Dynamic finder for /create/find
 */

import Alpine from "alpinejs"

const CategoryAll: string = "all";
const CategoryUploads: string = "shared";

// Debugging alpinejs access
window.Alpine = Alpine;

interface Finder {
    category: string
    search: string | null
    anyMatched: boolean

    SetCategory(now: string): void
    GetCategory(): string
    Match(name: string, category: string, online: boolean): boolean
    UpdateNothing(n: boolean): boolean
    NothingMatched(): boolean
    Search(term: string): void
}

document.addEventListener('alpine:init', () => {
    Alpine.data("finder", () => {
        // Cast allows for dynamic type checking by TypeScript
        return <Finder>{
            category: CategoryAll,
            search: null,
            anyMatched: false,

            SetCategory(now: string) {
                if (now == "") {
                    now = "Uncategorised";
                }

                this.anyMatched = false
                this.category = now.toLowerCase()
                console.log(this.category)
            },

            GetCategory(): string {
                return this.category.toLowerCase()
            },

            UpdateNothing(n: boolean): boolean {
                if (!this.anyMatched) {
                    this.anyMatched = n
                }
                return n
            },

            Match(name: string, category: string, online: boolean): boolean {
                if (this.search != null) {
                    if (name.toLowerCase().startsWith(this.search.toLowerCase())) {
                        return this.UpdateNothing(true)
                    }

                    return this.UpdateNothing(false)
                }

                if (online && this.category == CategoryUploads) {
                    return this.UpdateNothing(true)
                }

                return this.UpdateNothing(this.category == CategoryAll || this.category == category.toLowerCase())
            },

            Search(term: string) {
                this.category = CategoryAll;
                this.search = term;
            }
        };
    })
})

Alpine.start();
