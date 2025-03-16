export default function textToPascalCase(value: string):string{
    const text = `${value}`
    const upper = text.split(" ");
          for (let index = 0; index < upper.length; index++) {
            if (upper[index].length !== 0) {
              upper[index] =
                upper[index][0].toUpperCase() + upper[index].substr(1);
            }
          }

    return upper.join(" ");
}