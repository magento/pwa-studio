# Copyright © Magento, Inc. All rights reserved.
# See COPYING.txt for license details.

# frozen_string_literal: true

#
# This custom plugin dynamically sets the 'github_path' parameter
# for each page except 'redirect.html' pages.
# A value of the parameter is available as {{ page.github_path }}.
# The parameter contains a file path relative to its repository.
#
Jekyll::Hooks.register :pages, :post_init do |page|

  # Skip virtual pages like MRG topics
  next if page.kind_of? Jekyll::PageWithoutAFile
  # Process only files with 'md' and 'html' extensions
  next unless File.extname(page.path).match?(/md|html/)
  # Skip redirects
  next if page.name == 'redirect.html'

  dir = File.join(
    page.site.source,
    File.dirname(page.path)
  )
  
  filename = File.basename page.path

  # Change to the parent directory of the page and read full file path
  # from git index.
  Dir.chdir(dir) do
    page.data['github_path'] = `git ls-files --full-name #{filename}`.strip
  end
end
