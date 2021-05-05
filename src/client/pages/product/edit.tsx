import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { array, number, object, string } from 'yup';
import { useField } from 'formik';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import { Product } from '../../lib/api/products/type';
import Router, { useRouter } from 'next/router';
import ModalUploadImage from '../../components/modalUpload';
import { useMutation, useQuery } from 'react-query';
import Gallery from 'react-photo-gallery';
import SelectedImage from '../../components/selectedImage';
import { AuthContext, SubscriptionLevelEnum } from '../../lib/token';

interface Image {
  fileName: string;
  filePath: string;
}

interface ProductFieldProp {
  name: string;
  defaultValue: string;
  isCurrency?: boolean;
}

const ProductField = ({ name, defaultValue, isCurrency }: ProductFieldProp) => {
  const [field] = useField(name);
  const valueToShow =
    isCurrency && field.value
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(field.value)
      : field.value || defaultValue;

  return <span>{valueToShow}</span>;
};

type DefaltuValue = { data: Product; isLoading: boolean; error: unknown };

const defaltuValue: DefaltuValue = {
  data: {
    name: '',
    description: '',
    price: 0,
    images: [],
  },
  isLoading: false,
  error: undefined,
};

const ProductManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [savePic, setSavePic] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  // const [newPhotos, setNewPhotos] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  const isEdit = !Number.isNaN(+id);

  const { data: photosFormServer = [] } = useQuery(
    'images',
    () => axios.get<Array<Image>>('/images').then((res) => res.data),
    {
      onSuccess: (data) =>
        setPhotos(
          data.map((img) => ({
            ...img,
            src: `/public/${img.fileName}`,
            width: 1,
            height: 1,
          })),
        ),
    },
  );

  const { data: product, isLoading, error } = isEdit
    ? useQuery(['product', id], (context) =>
        axios
          .get<Product>(`/products/${context.queryKey[1]}`)
          .then((res) => res.data),
      )
    : defaltuValue;

  const ProductSchema = object().shape({
    name: string().required('Name is required'),
    description: string().required('Description is required'),
    price: number().required(),
    images: array().of(
      object().shape({
        id: number().required(),
      }),
    ),
  });

  const { mutateAsync: createProduct } = useMutation(
    'createProduct',
    (prod: Product) => axios.post('/products', prod),
  );
  const { mutateAsync: updateProduct } = useMutation(
    'updateProduct',
    (prod: Product) => axios.patch(`/products/${id}`, prod),
  );

  const save = (prod: Product) => {
    return isEdit ? updateProduct(prod) : createProduct(prod);
  };

  useEffect(() => {
    if (newPhotos && newPhotos.length > 0 && savePic) {
      const convertPhotos = newPhotos.map((ph) => {
        return {
          src: ph.url,
          width: 4,
          height: 3,
        };
      });
      setPhotos(photos.concat(convertPhotos));
    }
  }, [savePic, photosFormServer]);

  const { userAuthenticated } = useContext(AuthContext);

  const canOnlyView =
    !userAuthenticated ||
    (userAuthenticated &&
      userAuthenticated.role !== SubscriptionLevelEnum.Admin);

  const imageRenderer = useCallback(
    ({ index, left, top, key, photo, direction }) => (
      <SelectedImage
        selected={selectAll ? true : false}
        key={key}
        margin={'2px'}
        index={index}
        photo={photo}
        left={left}
        top={top}
        direction={direction}
        setSelected={setSelectedPhotos}
        selectedPhotos={selectedPhotos}
      />
    ),
    [selectAll],
  );

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const deleteSelected = () => {
    if (selectedPhotos && selectedPhotos.length > 0) {
      selectedPhotos.forEach(async (img) => {
        await axios
          .delete(`/images/${img.id}`)
          .then((res) => setPhotos(photos.filter((ar) => img.id !== ar.id)));
      });
    }
  };

  return (
    <>
      <Layout>
        {isLoading ? (
          <span className="flex h-3 w-3">
            <span className="animate-spin h-5 w-5 mr-3 bg-black opacity-75"></span>
          </span>
        ) : (
          <>
            {showModal && (
              <ModalUploadImage
                setShowModal={setShowModal}
                idProduct={product.id}
                previews={newPhotos}
                setPreviews={setNewPhotos}
                setSavePic={setSavePic}
              />
            )}
            <Formik
              enableReinitialize
              initialValues={{
                id: product?.id ?? undefined,
                name: product?.name ?? '',
                description: product?.description ?? '',
                price: product?.price ?? 0,
                images: product?.images ?? [],
              }}
              validationSchema={ProductSchema}
              onSubmit={(values, { resetForm }) =>
                save(values)
                  .then((v) => {
                    resetForm();
                    Router.push('/product');
                  })
                  .catch((err) =>
                    toast(
                      'Sorry, something went wrong. Please try again later!',
                      { type: 'error' },
                    ),
                  )
              }
            >
              {({ errors, touched }) => (
                <>
                  <div className="w-full lg:w-8/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100	 border-0">
                      <div className="rounded-t bg-white mb-0 px-6 py-6">
                        <div className="text-center flex justify-between">
                          <h6 className="text-blueGray-700 text-xl font-bold">
                            Product
                          </h6>
                        </div>
                      </div>
                      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <Form>
                          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Product Information
                          </h6>
                          <div className="flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4">
                              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                Name
                              </label>
                              <Field
                                type="text"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                name="name"
                                disabled={canOnlyView}
                              />
                              {touched.name && errors.name && (
                                <div className="font-mono text-red-500">
                                  {errors.name}
                                </div>
                              )}
                            </div>
                            <div className="w-full lg:w-6/12 px-4">
                              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                Price
                              </label>
                              <Field
                                type="number"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                name="price"
                                disabled={canOnlyView}
                              />
                              {touched.price && errors.price && (
                                <div className="font-mono text-red-500">
                                  {errors.price}
                                </div>
                              )}
                            </div>
                            <div className="w-full lg:w-12/12 px-4 mt-8">
                              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                Descripton
                              </label>
                              <Field
                                type="text"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                name="description"
                                disabled={canOnlyView}
                              />
                              {touched.description && errors.description && (
                                <div className="font-mono text-red-500">
                                  {errors.description}
                                </div>
                              )}
                            </div>
                            {!canOnlyView && (
                              <>
                                <div className="w-full lg:w-6/12 px-4 mt-8">
                                  <Field
                                    type="text"
                                    className="hidden"
                                    name="images"
                                  />
                                  <button
                                    className="bg-indigo-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                  >
                                    Select Images
                                  </button>
                                </div>
                                <div className="w-full lg:w-6/12 px-4 mt-8">
                                  <button
                                    className="bg-indigo-600 float-right text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                    type="submit"
                                  >
                                    Save
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
                      <div className="px-6">
                        <div className="text-center mt-12">
                          <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                            <ProductField
                              name="name"
                              defaultValue="Nome do produto"
                            />
                          </h3>
                          <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                            <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{' '}
                            <ProductField
                              name="price"
                              defaultValue="$0.00"
                              isCurrency
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                          <div className="w-full lg:w-9/12 px-4">
                            <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                              <ProductField
                                name="description"
                                defaultValue=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Formik>
            {!canOnlyView && (
              <p>
                <button
                  onClick={toggleSelectAll}
                  className="bg-indigo-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  toggle select all
                </button>
                <button
                  onClick={deleteSelected}
                  className="bg-indigo-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  delete selected
                </button>
              </p>
            )}
          </>
        )}
      </Layout>
      <div className="relative md:ml-64">
        <Gallery photos={photos} renderImage={imageRenderer} />
      </div>
    </>
  );
};

export default ProductManager;
