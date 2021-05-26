import {
    Home,
    Box,
    DollarSign,
    UserPlus,
    Users,
    Chrome,
    Settings,
    Airplay,
    FolderPlus,
    File,
    Command, Cloud, Book, FileText, Server, Image, Sliders, Map, GitPullRequest, Calendar, Edit, Mail, MessageSquare, UserCheck, Layers, HelpCircle, Database, Headphones, Mic, ShoppingBag, Search, AlertOctagon, Lock, Briefcase, BarChart,Target, List, Package
} from 'react-feather';

export const MENUITEMS = [

    {
        title: 'Orders', icon: Airplay, path: '/orders', type: 'link', active: false
    },
    {
        title: 'Add Product', icon: FolderPlus, path: '/create-product', type: 'link', active: false
    },
    {
        title: 'Products', icon: Command, path: '/products', type: 'link', active: false
    },
    {
        title: 'Users', icon: Users, path: '/users', type: 'link', active: false
    },
    {
        title: 'Coupons', icon: Layers, path: '/coupons', type: 'link', active: false
    }
]
