#!/usr/bin/env bash
add_composer_repository () {
    name=$1
    type=$2
    url=$3
    echo "adding composer repository ${url}"
    ${composer} config ${composerParams} repositories.${name} ${type} ${url}
}

add_venia_sample_data_repository () {
    name=$1
    add_composer_repository ${name} github "${githubBaseUrl}/${name}.git"
}

execute_install () {
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
  githubBaseUrl='git@github.com:PMET-public'

  cd $install_path

  for moduleName in "${moduleList[@]}"
  do
     add_venia_sample_data_repository ${moduleName}
  done

  ${composer} require ${composerParams} $(printf "${moduleVendor}/%s:dev-master@dev " "${moduleList[@]}")
}


skip_interactive=0
install_path=./

while test $# -gt 0; do
  case "$1" in
    --help)
                  echo "Magento 2 Venia Sample data script install."
                  echo "if no options are passed, it will start interactive mode and ask for your Magento absolute path"
                  echo ""
                  echo "Usage:"
                  echo "  deployVeniaSampleData.sh [options]"
                  echo "Options:"
                  echo "  --help    Displays this!"
                  echo "  --yes     Skip interactive mode and installs data"
                  echo "  --path    your Magento 2 absolute path, otherwise will install in current directory."
                  echo ""

                  exit 0
                  ;;
    --yes)        skip_interactive=1
                  shift
                  ;;
    --path*)      if test $# -gt 0; then
                    install_path=`echo $1 | sed -e 's/^[^=]*=//g'`
                  fi
                  shift
                  ;;
    *)            break
                  ;;
  esac

done


if [ "$skip_interactive" == 1 ]; then
  echo "Skipping interactive mode.."
  echo "Install path ${install_path}"
  execute_install
else
  echo "Please specify absolute path to your Magento 2 instance"
  read -p 'Magento root folder: ' install_path

  echo "Sample data will be installed there."
  echo ""
  read -p "Are you sure you want to continue? [y/n]" yn

  case $yn in
    y )
      execute_install
      ;;
    n )
      echo "Sample Data installation failed."
      exit 0
      ;;
    * )
      echo "Exiting..."
      exit 1
      ;;
  esac

fi
