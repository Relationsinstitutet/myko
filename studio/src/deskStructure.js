import S from '@sanity/desk-tool/structure-builder';
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list';

export default () =>
  S.list()
    .title('Contents')
    .items([
      orderableDocumentListDeskItem({type: 'activity', title: 'Ordered activities'}),
      ...S.documentTypeListItems().map(item => item.serialize()),
    ]);
