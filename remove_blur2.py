with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove overlay lines from JS
js = js.replace("  const dialog = document.getElementById('dialog-view-profile');\n  const overlay = document.getElementById('vp-loading-overlay');\n  if (dialog) dialog.showModal();\n  if (overlay) overlay.classList.remove('hidden');\n", "")
js = js.replace("    const dialog = document.getElementById('dialog-view-profile');\n    const overlay = document.getElementById('vp-loading-overlay');\n    if (dialog) dialog.showModal();\n    if (overlay) overlay.classList.remove('hidden');\n", "")
js = js.replace("  } finally {\n    const overlay = document.getElementById('vp-loading-overlay');\n    if (overlay) overlay.classList.add('hidden');\n  }", "}")
js = js.replace("  } finally {\n      const overlay = document.getElementById('vp-loading-overlay');\n      if (overlay) overlay.classList.add('hidden');\n    }", "}")

# Make sure dialog still opens - add showModal back at end of try
old_end = """    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}"""
new_end = """    renderReviewsProfile(reviews);
    document.getElementById('dialog-view-profile').showModal();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}"""
js = js.replace(old_end, new_end)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("JS overlay code removed")
