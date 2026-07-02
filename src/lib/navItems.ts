import { NavSection } from "@/src/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      items: [
        // {
        //   title: "Home",
        //   href: "/",
        //   icon: "Home",
        // },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        // {
        //   title: "My Profile",
        //   href: "/my-profile",
        //   icon: "User",
        // },
      ],
    },
    // {
    //     title: "Settings",
    //     items: [
    //         {
    //             title: "Change Password",
    //             href: "/change-password",
    //             icon: "Settings",
    //         },
    //     ],
    // },
  ];
};

// SaaS platform admins (SUPER_ADMIN / ADMIN)
export const adminNavItems: NavSection[] = [
  {
    title: "Platform Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins",
        icon: "Shield",
      },
      {
        title: "Organizations",
        href: "/admin/dashboard/organizations",
        icon: "Building2",
      },
      {
        title: "Plans",
        href: "/admin/dashboard/plans",
        icon: "BadgeDollarSign",
      },
      {
        title: "Subscriptions",
        href: "/admin/dashboard/subscriptions",
        icon: "CreditCard",
      },
      {
        title: "Payment requests",
        href: "/admin/dashboard/subscription-requests",
        icon: "Receipt",
      },
      {
        title: "Users",
        href: "/admin/dashboard/users",
        icon: "Users",
      },
      {
        title: "Activity logs",
        href: "/admin/dashboard/activity-logs",
        icon: "Activity",
      },
    ],
  },
];

// Landlord / property owner
export const ownerNavItems: NavSection[] = [
  {
    title: "Properties",
    items: [
      {
        title: "Buildings",
        href: "/owner/dashboard/buildings",
        icon: "Building",
      },
      {
        title: "Floors",
        href: "/owner/dashboard/floors",
        icon: "Layers",
      },
      {
        title: "Units",
        href: "/owner/dashboard/units",
        icon: "DoorOpen",
      },
    ],
  },
  {
    title: "Tenants & Leases",
    items: [
      {
        title: "Tenants",
        href: "/owner/dashboard/tenants",
        icon: "Users",
      },
      {
        title: "Leases",
        href: "/owner/dashboard/leases",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Invoices",
        href: "/owner/dashboard/invoices",
        icon: "Receipt",
      },
      {
        title: "Payments",
        href: "/owner/dashboard/payments",
        icon: "CreditCard",
      },
      {
        title: "Expenses",
        href: "/owner/dashboard/expenses",
        icon: "Banknote",
      },
      {
        title: "Reports",
        href: "/owner/dashboard/reports",
        icon: "BarChart3",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Complaints",
        href: "/owner/dashboard/complaints",
        icon: "MessageSquareWarning",
      },
      {
        title: "Documents",
        href: "/owner/dashboard/documents",
        icon: "FolderArchive",
      },
      {
        title: "Tenants Form",
        href: "/owner/dashboard/tenants-form",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        title: "Staff",
        href: "/owner/dashboard/staff",
        icon: "UserCog",
      },
      {
        title: "Organization",
        href: "/owner/dashboard/organization",
        icon: "Building2",
      },
      {
        title: "Subscription",
        href: "/owner/dashboard/subscription",
        icon: "BadgeDollarSign",
      },
      {
        title: "Activity logs",
        href: "/owner/dashboard/activity-logs",
        icon: "Activity",
      },
    ],
  },
];

// Manager — operates on behalf of owner
export const managerNavItems: NavSection[] = [
  {
    title: "Properties",
    items: [
      {
        title: "Buildings",
        href: "/manager/dashboard/buildings",
        icon: "Building",
      },
      {
        title: "Units",
        href: "/manager/dashboard/units",
        icon: "DoorOpen",
      },
    ],
  },
  {
    title: "Tenants & Leases",
    items: [
      {
        title: "Tenants",
        href: "/manager/dashboard/tenants",
        icon: "Users",
      },
      {
        title: "Leases",
        href: "/manager/dashboard/leases",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Invoices",
        href: "/manager/dashboard/invoices",
        icon: "Receipt",
      },
      {
        title: "Payments",
        href: "/manager/dashboard/payments",
        icon: "CreditCard",
      },
    ],
  },
];

// Caretaker — limited: payments, complaints, tenant updates
export const caretakerNavItems: NavSection[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Tenants",
        href: "/caretaker/dashboard/tenants",
        icon: "Users",
      },
      {
        title: "Invoices",
        href: "/caretaker/dashboard/invoices",
        icon: "Receipt",
      },
      {
        title: "Payments",
        href: "/caretaker/dashboard/payments",
        icon: "CreditCard",
      },
    ],
  },
];

// Tenant — renter portal
export const tenantNavItems: NavSection[] = [
  {
    title: "My Rental",
    items: [
      {
        title: "My Lease",
        href: "/tenant/dashboard/lease",
        icon: "FileText",
      },
      {
        title: "My Unit",
        href: "/tenant/dashboard/unit",
        icon: "DoorOpen",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Invoices",
        href: "/tenant/dashboard/invoices",
        icon: "Receipt",
      },
      {
        title: "Payments",
        href: "/tenant/dashboard/payments",
        icon: "CreditCard",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "OWNER":
      return [...commonNavItems, ...ownerNavItems];

    case "MANAGER":
      return [...commonNavItems, ...managerNavItems];

    case "CARETAKER":
      return [...commonNavItems, ...caretakerNavItems];

    case "TENANT":
      return [...commonNavItems, ...tenantNavItems];

    default:
      return commonNavItems;
  }
};
