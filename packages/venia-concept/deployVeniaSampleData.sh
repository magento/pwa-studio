#!/usr/bin/env bash

composer='/usr/bin/env composer'
composerParams='--no-interaction --ansi'
moduleVendor='magento'
moduleList=(
    module-catalog-sample-data-venia
    module-configurable-sample-data-venia
    module-customer-sample-data-venia
    module-sales-sample-data-venia
    module-tax-sample-data-venia
    sample-data-media-venia
)
githubBasUrl='git@github.com:PMET-public'

add_composer_repository () {
    name=$1
    type=$2
    url=$3
    echo "adding composer repository ${url}"
    ${composer} config ${composerParams} repositories.${name} ${type} ${url}
}

add_venia_sample_data_repository () {
    name=$1
    add_composer_repository ${name} github "${githubBasUrl}/${name}.git"
}

for moduleName in "${moduleList[@]}"
do
   add_venia_sample_data_repository ${moduleName}
done

${composer} require ${composerParams} $(printf "${moduleVendor}/%s:dev-master@dev " "${moduleList[@]}")
