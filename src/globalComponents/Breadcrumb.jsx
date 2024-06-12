import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Link, useLocation } from "react-router-dom"
  
  export function BreadcrumbDemo() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x)
    return (
      <Breadcrumb>
        <BreadcrumbList>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (

            <BreadcrumbItem key={name} className={`breadcrumb-item capitalize ${isLast ? 'breadcrumb-active' : ''}`}>
            {isLast ? (
                name
              ) : (
                <>
                  <Link to={routeTo} className="capitalize"> {name}</Link>
                  <BreadcrumbSeparator/> 
                </>
              )}
          </BreadcrumbItem>
           
        

          );
        })}
          
         
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  