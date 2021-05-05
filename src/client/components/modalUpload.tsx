import React, { FC, useCallback, useRef, useState } from 'react';
import { NextComponentType } from 'next';
import UploadButton from '@rpldy/upload-button';
import UploadPreview from '@rpldy/upload-preview';
import Uploady from '@rpldy/uploady';

interface PreviewProps {
  imgs: any[];
  setImgs: (arr: []) => void;
}

const PreviewsWithClear: FC<PreviewProps> = ({ imgs, setImgs }) => {
  const previewMethodsRef = useRef();
  const onPreviewsChanged = useCallback((previews) => {
    setImgs(previews);
  }, []);

  const onClear = useCallback(() => {
    if (
      previewMethodsRef &&
      previewMethodsRef.current &&
      // @ts-ignore
      previewMethodsRef.current.clear
    ) {
      // @ts-ignore
      previewMethodsRef.current.clear();
    }
  }, [previewMethodsRef]);

  return (
    <>
      <button
        onClick={onClear}
        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Clear {imgs.length} previews
      </button>
      <br />
      <div style={{ display: 'flex', height: '148px', marginTop: '15px' }}>
        <UploadPreview
          rememberPreviousBatches
          previewMethodsRef={previewMethodsRef}
          onPreviewsChanged={onPreviewsChanged}
        />
      </div>
    </>
  );
};

const ModalUploadImage: NextComponentType<
  {},
  {},
  {
    idProduct: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    previews: any[];
    setPreviews: React.Dispatch<React.SetStateAction<any[]>>;
    setSavePic: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ idProduct, setShowModal, previews, setPreviews, setSavePic }) => {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Image Uploader
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You can manage your product photos from here!
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Uploady destination={{ url: '/images', method: 'POST' }}>
                <UploadButton className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" />
                <PreviewsWithClear imgs={previews} setImgs={setPreviews} />
              </Uploady>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSavePic(true);
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSavePic(false);
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUploadImage;
