import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { RegisterComponent } from 'src/app/user/register/register.component';
import { LoginComponent } from 'src/app/shared/login/login.component';
import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from 'src/app/admin/admin-layout/admin-layout.component';
import { AuthService } from '../services/authorization.service';
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
import { HomeComponent } from '../shared/home/home.component';
import { LayoutComponent } from '../user/layout/layout.component';
import { AdminChangePasswordComponent } from '../admin/admin-change-password/admin-change-password.component';
import { RegisterAdminComponent } from '../admin/register-admin/register-admin.component';
import { ForgotPasswordComponent } from '../shared/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../shared/reset-password/reset-password.component';
import { LogoutComponent } from '../shared/logout/logout.component';

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
        data: { roles: ['admin', 'user'] },
        children: [
            {
                path: 'profile',
                component: SettingsComponent
            },
            {
                path: 'password',
                component: AdminChangePasswordComponent
            }
        ]
    },
    {
        path: 'admin/user/create',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: '',
                component: RegisterAdminComponent
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
