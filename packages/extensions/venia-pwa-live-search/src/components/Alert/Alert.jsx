/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import Checkmark from '../../icons/checkmark.svg';
import Error from '../../icons/error.svg';
import Info from '../../icons/info.svg';
import Warning from '../../icons/warning.svg';
import X from '../../icons/x.svg';

export const Alert = ({ title, type, description, url, onClick }) => {
  return (
    <div className="mx-auto max-w-8xl">
      {(() => {
        switch (type) {
          case 'error':
            return (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-1">
                    <img src={Error} className="h-5 w-5 text-red-400" aria-hidden="true" />
                    {/* <Error
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    /> */}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {title}
                    </h3>
                    {description?.length > 0 && (
                      <div className="mt-2 text-sm text-red-700">
                        <p>{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          case 'warning':
            return (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-1">
                    <img src={Warning} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    {/* <Warning
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    /> */}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {title}
                    </h3>
                    {description?.length > 0 && (
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          case 'info':
            return (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-1">
                    <img src={Info} className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    {/* <Info
                      className="h-5 w-5 text-blue-400"
                      aria-hidden="true"
                    /> */}
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">
                        {title}
                      </h3>
                      {description?.length > 0 && (
                        <div className="mt-2 text-sm text-blue-700">
                          <p>{description}</p>
                        </div>
                      )}
                    </div>
                    {url && (
                      <div className="mt-4 text-sm md:ml-6">
                        <a
                          href={url}
                          className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                        >
                          Details
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          case 'success':
            return (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-1">
                  <img src={Checkmark} alt="Success" className="h-5 w-5 text-green-400" aria-hidden="true" />
                    {/* <Checkmark
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    /> */}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {title}
                    </h3>
                    {description?.length > 0 && (
                      <div className="mt-2 text-sm text-green-700">
                        <p>{description}</p>
                      </div>
                    )}
                  </div>
                  {onClick && (
                    <div className="ml-auto">
                      <div className="md:ml-6">
                        <button
                          type="button"
                          className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 ring-off hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                          onClick={onClick}
                        >
                          <span className="sr-only">Dismiss</span>
                          <img src={X} className="h-5 w-5" aria-hidden="true" />
                          {/* <X
                            className="h-5 w-5"
                            aria-hidden="true"
                          /> */}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};
