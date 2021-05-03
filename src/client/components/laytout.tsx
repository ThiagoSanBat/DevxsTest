import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  return (
    <>
      <div className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <a className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
          DEXS
        </a>
        <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded hidden">
          <hr className="my-4 md:min-w-full"></hr>
          <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
            Manager
          </h6>
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            <li className="items-center">
              <Link href="/product">
                <a className="text-xs uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500">
                  <FontAwesomeIcon
                    icon={faTable}
                    className="fas fa-table mr-2 text-sm opacity-75"
                  />
                  Products
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative md:ml-64 bg-blueGray-100">
        <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
          <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            <a
              className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
              href="#pablo"
            >
              Dashboard
            </a>
          </div>
        </nav>
        <div className="relative bg-blue-400 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
