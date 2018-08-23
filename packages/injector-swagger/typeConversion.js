export default function aidaToSwaggerType(type) {
  switch (type) {
    case 'date':
    case 'datetime':
    case 'time':
    case 'string':
      return 'string';

    case 'year':
    case 'timestamp':
    case 'int64':
    case 'int32':
    case 'int16':
    case 'byte':
      return 'integer';

    case 'decimal':
    case 'double':
    case 'float':
      return 'number';

    case 'bool':
      return 'boolean';

    case 'bytes':
    case 'blog':
      return 'array';

    default:
      return 'string';
  }
}
