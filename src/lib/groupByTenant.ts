// src/lib/groupByTenant.ts
//
// Shared by the Invoices and Collection list pages: groups a flat list of
// records (each carrying an embedded `tenant` summary) into one entry per
// tenant, sorted alphabetically by tenant name. Used to render the "one
// accordion per tenant, one row per month inside" layout instead of a flat
// list where the same tenant repeats once per invoice/payment.

export interface TenantGroup<TTenant, TItem> {
    tenant: TTenant;
    items: TItem[];
}

/**
 * Groups `items` by `tenant.id`, preserving each item's original relative
 * order within its group, and returns groups sorted A→Z by `tenant.name`.
 *
 * Grouping key is `tenant.id` (not `tenant.name`) so two tenants that happen
 * to share a display name are never merged into one group.
 */
export function groupByTenant<
    TTenant extends { id: string; name: string },
    TItem extends { tenant: TTenant },
>(items: TItem[]): TenantGroup<TTenant, TItem>[] {
    const order: string[] = [];
    const byTenantId = new Map<string, TenantGroup<TTenant, TItem>>();

    for (const item of items) {
        const existing = byTenantId.get(item.tenant.id);
        if (existing) {
            existing.items.push(item);
        } else {
            byTenantId.set(item.tenant.id, {
                tenant: item.tenant,
                items: [item],
            });
            order.push(item.tenant.id);
        }
    }

    return order
        .map((id) => byTenantId.get(id)!)
        .sort((a, b) => a.tenant.name.localeCompare(b.tenant.name));
}
