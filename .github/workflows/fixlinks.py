import os
import sys
import re

def update_files(folder_path, static_prefix):
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if file_name.endswith(".html"):
                updated_links = update_html_file(file_path, static_prefix)
                if updated_links:
                    print(f"File: {file_path}")
                    print("Updated Links:")
                    print("\n".join(updated_links))
                    print()
            elif file_name.endswith(".css"):
                updated_urls = update_css_file(file_path, static_prefix)
                if updated_urls:
                    print(f"File: {file_path}")
                    print("Updated URLs:")
                    print("\n".join(updated_urls))
                    print()

def update_html_file(file_path, static_prefix):
    updated_links = []

    with open(file_path, "r") as file:
        content = file.read()

    updated_content = re.sub(
        r'((?:href|src|srcset)=["\'])(/[^"\'>]+)',
        fr'\1{static_prefix}\2',
        content
    )

    if updated_content != content:
        with open(file_path, "w") as file:
            file.write(updated_content)
        updated_links = find_updated_links(content, updated_content)

    return updated_links

def update_css_file(file_path, static_prefix):
    updated_urls = []

    with open(file_path, "r") as file:
        content = file.read()

    def replace_url(match):
        original_url = match.group(2)
        updated_url = static_prefix + original_url
        updated_urls.append(f"Original: {original_url}\nUpdated: {updated_url}\n")
        return f"url({match.group(1)}{updated_url}{match.group(1)})"

    updated_content = re.sub(
        r'url\((["\']?)(/[^)"\']+)\1\)',
        replace_url,
        content
    )

    if updated_content != content:
        with open(file_path, "w") as file:
            file.write(updated_content)

    return updated_urls

def find_updated_links(old_content, new_content):
    pattern = r'(?:href|src|srcset)=["\'](/[^"\'>]+)'
    old_links = set(re.findall(pattern, old_content))
    new_links = set(re.findall(pattern, new_content))
    updated_links = new_links - old_links
    return [f"Updated: {link}" for link in updated_links]

# Usage example
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py folder_path static_prefix")
        sys.exit(1)

    folder_path = sys.argv[1]
    static_prefix = sys.argv[2]
    update_files(folder_path, static_prefix)
