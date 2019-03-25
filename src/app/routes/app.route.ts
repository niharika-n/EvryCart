import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from 'src/app/admin/admin-layout/admin-layout.component';
import { AuthGuard } from '../services/auth.guard';
import { CategoryComponent } from 'src/app/admin/category/category.component';
import { CategoryfeaturesComponent } from 'src/app/admin/category/categoryfeatures/categoryfeatures.component';
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
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: 'add',
                component: CategoryfeaturesComponent
            },
            {
                path: 'detail/:id',
                component: CategoryfeaturesComponent
            },
            {
                path: '',
                component: CategoryComponent
            }
        ]
    },
    {
        path: 'admin/product',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: 'add',
                component: ProductfeaturesComponent
            },
            {
                path: 'detail/:id',
                component: ProductfeaturesComponent
            },
            {
                path: '',
                component: ProductComponent
            },
            {
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
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: 'profile',
                component: SettingsComponent
            },
            {
                path: 'password',
                component: AdminChangePasswordComponent
            },
            {
                path: 'template',
                component: EmailTemplateComponent
            }
        ]
    },
    {
        path: 'admin/user',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['superadmin'] },
        children: [
            {
                path: 'create',
                component: RegisterAdminComponent
            },
            {
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
