{
  "targets": [
    {
      "target_name": "ref",
      "sources": [ "src/binding.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
