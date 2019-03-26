import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { AuthGuard } from '../services/auth.guard';
import { CategoryComponent } from '../admin/category/category.component';
import { CategoryfeaturesComponent } from '../admin/category/categoryfeatures/categoryfeatures.component';
import { SettingsComponent } from '../admin/settings/settings.component';
import { LocationComponent } from '../shared/location/location.component';
import { ProductComponent } from '../admin/product/product.component';
import { ProductfeaturesComponent } from '../admin/product/productfeatures/productfeatures.component';
import { ProductAttributesComponent } from '../admin/product-attributes/product-attributes.component';
import {
    ProductAttributeFeaturesComponent
} from '../admin/product-attributes/product-attribute-features/product-attribute-features.component';
import { AdminChangePasswordComponent } from '../admin/admin-change-password/admin-change-password.component';
import { RegisterAdminComponent } from '../admin/register-admin/register-admin.component';
import { RegisterComponent } from '../features/register/register.component';
import { LoginComponent } from '../features/login/login.component';
import { ForgotPasswordComponent } from '../features/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../features/reset-password/reset-password.component';
import { LogoutComponent } from '../features/logout/logout.component';
import { LayoutComponent } from '../features/layout/layout.component';
import { HomeComponent } from '../features/home/home.component';
import { EmailTemplateComponent } from '../admin/email-template/email-template.component';
import { UserDetailComponent } from '../admin/user-detail/user-detail.component';

const routes: Routes = [
    {
        path: 'admin/dashboard',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: '',
                component: DashboardComponent
            }
        ]
    },
    {
        path: 'admin/category',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                data: { roles: ['admin'] },
                path: 'add',
                component: CategoryfeaturesComponent
            },
            {
                data: { roles: ['admin'] },
                path: 'detail/:id',
                component: CategoryfeaturesComponent
            },
            {
                data: { roles: ['admin'] },
                path: '',
                component: CategoryComponent
            }
        ]
    },
    {
        path: 'admin/product',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                data: { roles: ['admin'] },
                path: 'add',
                component: ProductfeaturesComponent
            },
            {
                data: { roles: ['admin'] },
                path: 'detail/:id',
                component: ProductfeaturesComponent
            },
            {
                data: { roles: ['admin'] },
                path: '',
                component: ProductComponent
            },
            {
                data: { roles: ['admin'] },
                path: 'attribute',
                children: [
                    {
                        path: 'add',
                        component: ProductAttributeFeaturesComponent
                    },
                    {
                        path: 'detail/:id',
                        component: ProductAttributeFeaturesComponent
                    },
                    {
                        path: '',
                        component: ProductAttributesComponent
                    }
                ]
            }
        ]
    },
    {
        path: 'admin/edit',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                data: { roles: ['admin'] },
                path: 'profile',
                component: SettingsComponent
            },
            {
                data: { roles: ['admin'] },
                path: 'password',
                component: AdminChangePasswordComponent
            },
            {
                data: { roles: ['admin'] },
                path: 'template',
                component: EmailTemplateComponent
            }
        ]
    },
    {
        path: 'admin/user',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuard],
        data: { roles: ['superadmin'] },
        children: [
            {
                data: { roles: ['superadmin'] },
                path: 'create',
                component: RegisterAdminComponent
            },
            {
                data: { roles: ['superadmin'] },
                path: 'list',
                component: UserDetailComponent
            }
        ]
    },
    {
        path: 'admin/location',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: '',
                component: LocationComponent
            }
        ]
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot_password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset_password/:id',
        component: ResetPasswordComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                pathMatch: 'full'
            }
        ]
    }
];
export const APPROUTERMODULE = RouterModule.forRoot(routes, { useHash: false });
