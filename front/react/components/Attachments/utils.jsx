export function formatAssemblyOptionsFromItemMetadata(metadata) {
  const items = metadata.items || []

  return items.flatMap((item) => {
    const options = item.assemblyOptions || []

    return options.flatMap((option) => {
      return (option.inputValues || []).map((input) => ({
        name: option.name.toLowerCase(),
        options: input.domain.map((value) => ({
          value: value,
          label: input.label,
          id: option.name,
        })),
      }))
    })
  })
}
