export default function Header() {
    return (
        <>
            <header className="bg-surface-primary border-bottom pt-6">
                <div className="container-fluid">
                <div className="mb-npx">
                    <div className="row align-items-center">
                    <div className="col-sm-6 col-12 mb-4 mb-sm-0">
                        <h1 className="h2 mb-0 ls-tight">Application</h1>
                    </div>

                    
                    </div>

                    <ul className="nav nav-tabs mt-4 overflow-x border-0">
                    <li className="nav-item ">
                        <a href="#" className="nav-link active">
                        dashboard
                        </a>
                    </li>
                    </ul>
                </div>
                </div>
            </header>
        </>
    );
}