/** THIS IS GENERATED FILE. DO NOT MODIFY IT DIRECTLY, RUN 'yarn graphql' INSTEAD. **/
import * as DrupalTypes from './drupal.d';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export const FragmentPageInfoFragmentDoc = gql`
    fragment FragmentPageInfo on ConnectionPageInfo {
  hasNextPage
  endCursor
}
    `;
export const AllNodeInterfaceFragmentDoc = gql`
    fragment AllNodeInterface on NodeInterface {
  id
  path
  changed {
    time
  }
}
    `;
export const FragmentDateTimeFragmentDoc = gql`
    fragment FragmentDateTime on DateTime {
  timezone
  time
}
    `;
export const FragmentNodeInterfaceFragmentDoc = gql`
    fragment FragmentNodeInterface on NodeInterface {
  __typename
  id
  title
  status
  path
  changed {
    ...FragmentDateTime
  }
  created {
    ...FragmentDateTime
  }
}
    ${FragmentDateTimeFragmentDoc}`;
export const FragmentNameTypeFragmentDoc = gql`
    fragment FragmentNameType on NameType {
  title
  given
  middle
  family
  generational
  credentials
}
    `;
export const FragmentSupAwardFragmentDoc = gql`
    fragment FragmentSupAward on SupAward {
  id
  name
  supAssociation
  supDescription {
    processed
  }
  supPlace
  supRank
  supWorkId
  supYear
}
    `;
export const FragmentParagraphInterfaceFragmentDoc = gql`
    fragment FragmentParagraphInterface on ParagraphInterface {
  __typename
  id
  behaviors
  status
}
    `;
export const FragmentParagraphStanfordAccordionFragmentDoc = gql`
    fragment FragmentParagraphStanfordAccordion on ParagraphStanfordAccordion {
  ...FragmentParagraphInterface
  suAccordionBody {
    processed
  }
  suAccordionTitle
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentMediaInterfaceFragmentDoc = gql`
    fragment FragmentMediaInterface on MediaInterface {
  __typename
  id
  name
}
    `;
export const FragmentMediaImageFragmentDoc = gql`
    fragment FragmentMediaImage on MediaImage {
  ...FragmentMediaInterface
  mediaImage {
    url
    alt
    height
    width
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordBannerFragmentDoc = gql`
    fragment FragmentParagraphStanfordBanner on ParagraphStanfordBanner {
  ...FragmentParagraphInterface
  suBannerHeader
  suBannerBody {
    processed
  }
  suBannerSupHeader
  suBannerButton {
    url
    title
  }
  suBannerImage {
    ...FragmentMediaImage
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentMediaEmbeddableFragmentDoc = gql`
    fragment FragmentMediaEmbeddable on MediaEmbeddable {
  ...FragmentMediaInterface
  mediaEmbeddableCode
  mediaEmbeddableOembed
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaFileFragmentDoc = gql`
    fragment FragmentMediaFile on MediaFile {
  ...FragmentMediaInterface
  mediaFile {
    url
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaGoogleFormFragmentDoc = gql`
    fragment FragmentMediaGoogleForm on MediaGoogleForm {
  ...FragmentMediaInterface
  mediaGoogleForm
  mediaGoogleForm
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaStanfordGalleryImageFragmentDoc = gql`
    fragment FragmentMediaStanfordGalleryImage on MediaStanfordGalleryImage {
  ...FragmentMediaInterface
  suGalleryCaption
  suGalleryImage {
    url
    alt
    height
    width
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaVideoFragmentDoc = gql`
    fragment FragmentMediaVideo on MediaVideo {
  ...FragmentMediaInterface
  mediaOembedVideo
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaUnionFragmentDoc = gql`
    fragment FragmentMediaUnion on MediaUnion {
  ...FragmentMediaEmbeddable
  ...FragmentMediaFile
  ...FragmentMediaGoogleForm
  ...FragmentMediaImage
  ...FragmentMediaStanfordGalleryImage
  ...FragmentMediaVideo
}
    ${FragmentMediaEmbeddableFragmentDoc}
${FragmentMediaFileFragmentDoc}
${FragmentMediaGoogleFormFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentMediaStanfordGalleryImageFragmentDoc}
${FragmentMediaVideoFragmentDoc}`;
export const FragmentParagraphStanfordCardFragmentDoc = gql`
    fragment FragmentParagraphStanfordCard on ParagraphStanfordCard {
  ...FragmentParagraphInterface
  suCardHeader
  suCardSuperHeader
  suCardBody {
    processed
  }
  suCardLink {
    url
    title
  }
  suCardMedia {
    ...FragmentMediaUnion
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentParagraphStanfordEntityFragmentDoc = gql`
    fragment FragmentParagraphStanfordEntity on ParagraphStanfordEntity {
  ...FragmentParagraphInterface
  suEntityHeadline
  suEntityDescription {
    processed
  }
  suEntityButton {
    url
    title
  }
  suEntityItem {
    ... on NodeInterface {
      id
      path
    }
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordGalleryFragmentDoc = gql`
    fragment FragmentParagraphStanfordGallery on ParagraphStanfordGallery {
  ...FragmentParagraphInterface
  suGalleryHeadline
  suGalleryDescription {
    processed
  }
  suGalleryButton {
    url
    title
  }
  suGalleryImages {
    ...FragmentMediaStanfordGalleryImage
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaStanfordGalleryImageFragmentDoc}`;
export const FragmentParagraphStanfordListFragmentDoc = gql`
    fragment FragmentParagraphStanfordList on ParagraphStanfordList {
  ...FragmentParagraphInterface
  suListHeadline
  supListEyebrow
  suListDescription {
    processed
  }
  suListButton {
    url
    title
  }
  suListView {
    view
    display
    contextualFilter
    pageSize
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordMediaCaptionFragmentDoc = gql`
    fragment FragmentParagraphStanfordMediaCaption on ParagraphStanfordMediaCaption {
  ...FragmentParagraphInterface
  suMediaCaptionMedia {
    ...FragmentMediaUnion
  }
  suMediaCaptionLink {
    url
    title
  }
  suMediaCaptionCaption {
    processed
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentParagraphStanfordSpacerFragmentDoc = gql`
    fragment FragmentParagraphStanfordSpacer on ParagraphStanfordSpacer {
  ...FragmentParagraphInterface
  suSpacerSize
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordWysiwygFragmentDoc = gql`
    fragment FragmentParagraphStanfordWysiwyg on ParagraphStanfordWysiwyg {
  ...FragmentParagraphInterface
  suWysiwygText {
    processed
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordLayoutFragmentDoc = gql`
    fragment FragmentParagraphStanfordLayout on ParagraphStanfordLayout {
  ...FragmentParagraphInterface
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentLinkFragmentDoc = gql`
    fragment FragmentLink on Link {
  title
  url
}
    `;
export const FragmentParagraphSupCarouselSlideFragmentDoc = gql`
    fragment FragmentParagraphSupCarouselSlide on ParagraphSupCarouselSlide {
  ...FragmentParagraphInterface
  supSlideBody {
    processed
  }
  supSlideBodySize
  supSlideBook {
    ... on NodeSupBook {
      id
      title
      path
      supBookAuthorsFull
      supBookImage {
        ...FragmentMediaImage
      }
      supBookLocalWebBlurb {
        processed
      }
    }
  }
  supSlideButton {
    ...FragmentLink
  }
  supSlideColor
  supSlideEyebrow
  supSlideHide
  supSlideOrientation
  supSlideSubtitle
  supSlideTitle
  supSlideTitleSize
  supSlideImage {
    ...FragmentMediaImage
  }
  supSlideBgImage {
    ...FragmentMediaImage
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentLinkFragmentDoc}`;
export const FragmentParagraphSupCarouselFragmentDoc = gql`
    fragment FragmentParagraphSupCarousel on ParagraphSupCarousel {
  ...FragmentParagraphInterface
  supCarouselSlides {
    ...FragmentParagraphSupCarouselSlide
  }
  supCarouselTopHero
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphSupCarouselSlideFragmentDoc}`;
export const FragmentMediaSupProtectedFileFragmentDoc = gql`
    fragment FragmentMediaSupProtectedFile on MediaSupProtectedFile {
  ...FragmentMediaInterface
  supMediaFile {
    url
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentParagraphSupFileListFragmentDoc = gql`
    fragment FragmentParagraphSupFileList on ParagraphSupFileList {
  ...FragmentParagraphInterface
  supFileListLabel
  supFileListFiles {
    ...FragmentMediaFile
    ...FragmentMediaSupProtectedFile
  }
  supFileListDisplay
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaFileFragmentDoc}
${FragmentMediaSupProtectedFileFragmentDoc}`;
export const FragmentParagraphSupAuthorListFragmentDoc = gql`
    fragment FragmentParagraphSupAuthorList on ParagraphSupAuthorList {
  ...FragmentParagraphInterface
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphSupSearchFormFragmentDoc = gql`
    fragment FragmentParagraphSupSearchForm on ParagraphSupSearchForm {
  ...FragmentParagraphInterface
  supSearchBooksOnly
  supSearchSubject {
    ... on TermInterface {
      id
      name
    }
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphSupBlogFragmentDoc = gql`
    fragment FragmentParagraphSupBlog on ParagraphSupBlog {
  ...FragmentParagraphInterface
  supBlogBody
  supBlogImage {
    ...FragmentMediaImage
  }
  supBlogTitle
  supBlogUrl {
    ...FragmentLink
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentLinkFragmentDoc}`;
export const FragmentParagraphSupBlogTeaserFragmentDoc = gql`
    fragment FragmentParagraphSupBlogTeaser on ParagraphSupBlogTeaser {
  ...FragmentParagraphInterface
  supBlogTeaserHeader
  supBlogTeaserItems {
    ...FragmentParagraphSupBlog
  }
  supBlogTeaserLink {
    ...FragmentLink
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphSupBlogFragmentDoc}
${FragmentLinkFragmentDoc}`;
export const FragmentParagraphUnionFragmentDoc = gql`
    fragment FragmentParagraphUnion on ParagraphUnion {
  ...FragmentParagraphInterface
  ...FragmentParagraphStanfordAccordion
  ...FragmentParagraphStanfordBanner
  ...FragmentParagraphStanfordCard
  ...FragmentParagraphStanfordEntity
  ...FragmentParagraphStanfordGallery
  ...FragmentParagraphStanfordList
  ...FragmentParagraphStanfordMediaCaption
  ...FragmentParagraphStanfordSpacer
  ...FragmentParagraphStanfordWysiwyg
  ...FragmentParagraphStanfordLayout
  ...FragmentParagraphSupCarousel
  ...FragmentParagraphSupFileList
  ...FragmentParagraphSupAuthorList
  ...FragmentParagraphSupSearchForm
  ...FragmentParagraphSupBlogTeaser
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordAccordionFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordCardFragmentDoc}
${FragmentParagraphStanfordEntityFragmentDoc}
${FragmentParagraphStanfordGalleryFragmentDoc}
${FragmentParagraphStanfordListFragmentDoc}
${FragmentParagraphStanfordMediaCaptionFragmentDoc}
${FragmentParagraphStanfordSpacerFragmentDoc}
${FragmentParagraphStanfordWysiwygFragmentDoc}
${FragmentParagraphStanfordLayoutFragmentDoc}
${FragmentParagraphSupCarouselFragmentDoc}
${FragmentParagraphSupFileListFragmentDoc}
${FragmentParagraphSupAuthorListFragmentDoc}
${FragmentParagraphSupSearchFormFragmentDoc}
${FragmentParagraphSupBlogTeaserFragmentDoc}`;
export const FragmentTermInterfaceFragmentDoc = gql`
    fragment FragmentTermInterface on TermInterface {
  __typename
  id
  name
  path
  weight
  parent {
    ... on TermInterface {
      id
    }
  }
}
    `;
export const FragmentNodeSupBookFragmentDoc = gql`
    fragment FragmentNodeSupBook on NodeSupBook {
  ...FragmentNodeInterface
  supBookAuthorInfo {
    processed
  }
  supBookAuthors {
    ...FragmentNameType
  }
  supBookAuthorsFull
  supBookAvailDesc
  supBookAwards {
    ...FragmentSupAward
  }
  supBookCatalogMonth
  supBookCatalogPage
  supBookCatalogSeasonYyyy
  supBookClothSalePercent
  supBookClothSalePrice
  supBookCopublisherName
  supBookCopublisherYn
  supBookCopyright
  supBookDescription {
    processed
  }
  supBookDigitalCompLink
  supBookExcerpts {
    ...FragmentParagraphUnion
  }
  supBookHtmlPageTitle
  supBookIllustrations
  supBookImage {
    ...FragmentMediaImage
  }
  supBookImprint {
    ...FragmentTermInterface
  }
  supBookInPrintStatus
  supBookInstructorRecommended
  supBookIntlCart
  supBookIsbn13Alt
  supBookIsbn13Cloth
  supBookIsbn13Digital
  supBookIsbn13Isw
  supBookIsbn13Paper
  supBookLocalWebBlurb {
    processed
  }
  supBookNewPaperbackYn
  supBookPages
  supBookPaperSalePercent
  supBookPaperSalePrice
  supBookPriceCloth
  supBookPriceDigital
  supBookPricePaper
  supBookPrintDeskCopies
  supBookPubDateCloth {
    ...FragmentDateTime
  }
  supBookPubDateDigital {
    ...FragmentDateTime
  }
  supBookPubDateFirst {
    ...FragmentDateTime
  }
  supBookPubDatePaper {
    ...FragmentDateTime
  }
  supBookPubYearFirst
  supBookRelatedTitles {
    ...FragmentNodeInterface
  }
  supBookReviews {
    processed
  }
  supBookRightsDescription
  supBookSalesRank
  supBookSeries {
    ...FragmentTermInterface
  }
  supBookStatusCloth
  supBookStatusDigital
  supBookStatusPaper
  supBookSubjects {
    __typename
    id
    name
    weight
    parent {
      ... on TermInterface {
        id
        name
      }
    }
  }
  supBookSubtitle
  supBookTableOfContents {
    processed
  }
  supBookUrlIsw
  supBookWebCodeCloth
  supBookWebCodePaper
  supBookWorkIdNumber
  supBookERetailers {
    ...FragmentLink
  }
  supBookType
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNameTypeFragmentDoc}
${FragmentSupAwardFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentDateTimeFragmentDoc}
${FragmentLinkFragmentDoc}`;
export const FragmentNodeStanfordCourseFragmentDoc = gql`
    fragment FragmentNodeStanfordCourse on NodeStanfordCourse {
  ...FragmentNodeInterface
  body {
    processed
  }
  suCourseAcademicYear
  suCourseCode
  suCourseId
  suCourseInstructors
  suCourseLink {
    url
    title
  }
  suCourseQuarters {
    ...FragmentTermInterface
  }
  suCourseSectionUnits
  suCourseSubject {
    ...FragmentTermInterface
  }
  suCourseTags {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentSmartDateTypeFragmentDoc = gql`
    fragment FragmentSmartDateType on SmartDateType {
  value
  end_value
  timezone
  rrule_index
  rrule
}
    `;
export const FragmentAddressTypeFragmentDoc = gql`
    fragment FragmentAddressType on Address {
  langcode
  country {
    name
    code
  }
  givenName
  additionalName
  familyName
  organization
  addressLine1
  addressLine2
  postalCode
  sortingCode
  dependentLocality
  locality
  administrativeArea
}
    `;
export const FragmentParagraphStanfordPersonCtumFragmentDoc = gql`
    fragment FragmentParagraphStanfordPersonCtum on ParagraphStanfordPersonCtum {
  ...FragmentParagraphInterface
  suPersonCtaName
  suPersonCtaTitle
  suPersonCtaLink {
    url
    title
  }
  suPersonCtaImage {
    ...FragmentMediaImage
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentParagraphStanfordScheduleFragmentDoc = gql`
    fragment FragmentParagraphStanfordSchedule on ParagraphStanfordSchedule {
  ...FragmentParagraphInterface
  suScheduleHeadline
  suScheduleDescription {
    processed
  }
  suScheduleDateTime {
    ...FragmentSmartDateType
  }
  suScheduleLocation {
    ...FragmentAddressType
  }
  suScheduleUrl {
    url
    title
  }
  suScheduleSpeaker {
    ...FragmentParagraphStanfordPersonCtum
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentAddressTypeFragmentDoc}
${FragmentParagraphStanfordPersonCtumFragmentDoc}`;
export const FragmentNodeStanfordEventFragmentDoc = gql`
    fragment FragmentNodeStanfordEvent on NodeStanfordEvent {
  ...FragmentNodeInterface
  body {
    processed
  }
  suEventAltLoc
  suEventAudience {
    ...FragmentTermInterface
  }
  suEventComponents {
    ...FragmentParagraphUnion
  }
  suEventContactInfo
  suEventCta {
    url
    title
  }
  suEventDateTime {
    ...FragmentSmartDateType
  }
  suEventDek
  suEventEmail
  suEventGroups {
    ...FragmentTermInterface
  }
  suEventKeywords {
    ...FragmentTermInterface
  }
  suEventLocation {
    ...FragmentAddressType
  }
  suEventMapLink {
    url
    title
  }
  suEventSchedule {
    ...FragmentParagraphStanfordSchedule
  }
  suEventSource {
    url
    title
  }
  suEventSponsor
  suEventSubheadline
  suEventSubject {
    ...FragmentTermInterface
  }
  suEventTelephone
  suEventType {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentAddressTypeFragmentDoc}
${FragmentParagraphStanfordScheduleFragmentDoc}`;
export const FragmentNodeStanfordEventTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordEventTeaser on NodeStanfordEvent {
  ...FragmentNodeInterface
  suEventAltLoc
  suEventSubheadline
  suEventDek
  suEventLocation {
    ...FragmentAddressType
  }
  suEventDateTime {
    ...FragmentSmartDateType
  }
  suEventType {
    ...FragmentTermInterface
  }
  suEventSource {
    url
    title
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentAddressTypeFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordEventSeriesFragmentDoc = gql`
    fragment FragmentNodeStanfordEventSeries on NodeStanfordEventSeries {
  ...FragmentNodeInterface
  suEventSeriesComponents {
    ...FragmentParagraphUnion
  }
  suEventSeriesDek
  suEventSeriesEvent {
    ...FragmentNodeStanfordEventTeaser
  }
  suEventSeriesSubheadline
  suEventSeriesType {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordNewsFragmentDoc = gql`
    fragment FragmentNodeStanfordNews on NodeStanfordNews {
  ...FragmentNodeInterface
  suNewsBanner {
    ...FragmentMediaUnion
  }
  suNewsBannerMediaCaption
  suNewsByline
  suNewsComponents {
    ...FragmentParagraphUnion
  }
  suNewsDek
  suNewsFeaturedMedia {
    ...FragmentMediaUnion
  }
  suNewsHideSocial
  suNewsPublishingDate {
    ...FragmentDateTime
  }
  suNewsSource {
    url
    title
  }
  suNewsTopics {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaUnionFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentDateTimeFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordPageTitleBannerFragmentDoc = gql`
    fragment FragmentParagraphStanfordPageTitleBanner on ParagraphStanfordPageTitleBanner {
  ...FragmentParagraphInterface
  suTitleBannerImage {
    ...FragmentMediaImage
  }
  supTitleBannerColor
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentNodeStanfordPageFragmentDoc = gql`
    fragment FragmentNodeStanfordPage on NodeStanfordPage {
  ...FragmentNodeInterface
  layoutSelection {
    id
  }
  suBasicPageType {
    ...FragmentTermInterface
  }
  suPageBanner {
    ...FragmentParagraphStanfordBanner
    ...FragmentParagraphStanfordPageTitleBanner
    ...FragmentParagraphSupCarousel
  }
  suPageComponents {
    ...FragmentParagraphUnion
  }
  suPageDescription
  suPageImage {
    ...FragmentMediaUnion
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordPageTitleBannerFragmentDoc}
${FragmentParagraphSupCarouselFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentNodeStanfordPersonFragmentDoc = gql`
    fragment FragmentNodeStanfordPerson on NodeStanfordPerson {
  ...FragmentNodeInterface
  body {
    processed
  }
  suPersonAcademicAppt
  suPersonAdminAppts
  suPersonAffiliations {
    url
    title
  }
  suPersonComponents {
    ...FragmentParagraphUnion
  }
  suPersonEducation
  suPersonEmail
  suPersonFax
  suPersonFirstName
  suPersonFullTitle
  suPersonLastName
  suPersonLinks {
    url
    title
  }
  suPersonLocationAddress {
    processed
  }
  suPersonLocationName
  suPersonMailCode
  suPersonMapUrl {
    url
    title
  }
  suPersonMobilePhone
  suPersonPhoto {
    ...FragmentMediaImage
  }
  suPersonProfileLink {
    url
    title
  }
  suPersonPronouns
  suPersonResearch {
    processed
  }
  suPersonResearchInterests
  suPersonScholarlyInterests {
    processed
  }
  suPersonShortTitle
  suPersonTelephone
  suPersonTypeGroup {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentSuPolicyLogFragmentDoc = gql`
    fragment FragmentSuPolicyLog on SuPolicyLog {
  __typename
  id
  suPolicyDate {
    ...FragmentDateTime
  }
  suPolicyNotes
  suPolicyPublic
  suPolicyTitle
}
    ${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPolicyFragmentDoc = gql`
    fragment FragmentNodeStanfordPolicy on NodeStanfordPolicy {
  ...FragmentNodeInterface
  body {
    processed
  }
  suPolicyAuthority
  suPolicyAutoPrefix
  suPolicyChangelog {
    ...FragmentSuPolicyLog
  }
  suPolicyChapter
  suPolicyEffective {
    ...FragmentDateTime
  }
  suPolicyPolicyNum
  suPolicyRelated {
    ... on NodeInterface {
      id
      path
    }
  }
  suPolicySubchapter
  suPolicyTitle
  suPolicyUpdated {
    ...FragmentDateTime
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentSuPolicyLogFragmentDoc}
${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPersonTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPersonTeaser on NodeStanfordPerson {
  ...FragmentNodeInterface
  suPersonPhoto {
    ...FragmentMediaImage
  }
  suPersonFullTitle
  suPersonShortTitle
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentNodeStanfordPublicationFragmentDoc = gql`
    fragment FragmentNodeStanfordPublication on NodeStanfordPublication {
  ...FragmentNodeInterface
  suPublicationAuthorRef {
    ...FragmentNodeStanfordPersonTeaser
  }
  suPublicationComponents {
    ...FragmentParagraphUnion
  }
  suPublicationCta {
    url
    title
  }
  suPublicationImage {
    ...FragmentMediaImage
  }
  suPublicationTopics {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeSupBookAncillaryFragmentDoc = gql`
    fragment FragmentNodeSupBookAncillary on NodeSupBookAncillary {
  ...FragmentNodeInterface
  supAncillaryBook {
    ...FragmentNodeInterface
    supBookSubtitle
    supBookAuthorsFull
    supBookImage {
      ...FragmentMediaImage
    }
  }
  supAncillaryParagraphs {
    ...FragmentParagraphUnion
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentParagraphUnionFragmentDoc}`;
export const FragmentNodeUnionFragmentDoc = gql`
    fragment FragmentNodeUnion on NodeUnion {
  ...FragmentNodeSupBook
  ...FragmentNodeInterface
  ...FragmentNodeStanfordCourse
  ...FragmentNodeStanfordEvent
  ...FragmentNodeStanfordEventSeries
  ...FragmentNodeStanfordNews
  ...FragmentNodeStanfordPage
  ...FragmentNodeStanfordPerson
  ...FragmentNodeStanfordPolicy
  ...FragmentNodeStanfordPublication
  ...FragmentNodeSupBookAncillary
}
    ${FragmentNodeSupBookFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordCourseFragmentDoc}
${FragmentNodeStanfordEventFragmentDoc}
${FragmentNodeStanfordEventSeriesFragmentDoc}
${FragmentNodeStanfordNewsFragmentDoc}
${FragmentNodeStanfordPageFragmentDoc}
${FragmentNodeStanfordPersonFragmentDoc}
${FragmentNodeStanfordPolicyFragmentDoc}
${FragmentNodeStanfordPublicationFragmentDoc}
${FragmentNodeSupBookAncillaryFragmentDoc}`;
export const FragmentNodeSupBookTeaserFragmentDoc = gql`
    fragment FragmentNodeSupBookTeaser on NodeSupBook {
  ...FragmentNodeInterface
  supBookAuthors {
    ...FragmentNameType
  }
  supBookAwards {
    ...FragmentSupAward
  }
  supBookSubtitle
  supBookWorkIdNumber
  supBookAuthorsFull
  supBookImage {
    ...FragmentMediaImage
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNameTypeFragmentDoc}
${FragmentSupAwardFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentNodeStanfordCourseTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordCourseTeaser on NodeStanfordCourse {
  ...FragmentNodeInterface
  suCourseSubject {
    ...FragmentTermInterface
  }
  suCourseAcademicYear
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordEventSeriesTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordEventSeriesTeaser on NodeStanfordEventSeries {
  ...FragmentNodeInterface
  suEventSeriesDek
}
    ${FragmentNodeInterfaceFragmentDoc}`;
export const FragmentNodeStanfordNewsTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordNewsTeaser on NodeStanfordNews {
  ...FragmentNodeInterface
  suNewsDek
  suNewsFeaturedMedia {
    ...FragmentMediaImage
  }
  suNewsTopics {
    ...FragmentTermInterface
  }
  suNewsPublishingDate {
    ...FragmentDateTime
  }
  suNewsSource {
    url
    title
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPageTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPageTeaser on NodeStanfordPage {
  ...FragmentNodeInterface
  suPageDescription
  suPageImage {
    ...FragmentMediaImage
  }
  suPageBanner {
    ...FragmentParagraphStanfordBanner
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}`;
export const FragmentNodeStanfordPolicyTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPolicyTeaser on NodeStanfordPolicy {
  ...FragmentNodeInterface
  body {
    processed
    summary
  }
}
    ${FragmentNodeInterfaceFragmentDoc}`;
export const FragmentNodeStanfordPublicationTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPublicationTeaser on NodeStanfordPublication {
  ...FragmentNodeInterface
  suPublicationTopics {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeTeaserUnionFragmentDoc = gql`
    fragment FragmentNodeTeaserUnion on NodeUnion {
  ...FragmentNodeSupBookTeaser
  ...FragmentNodeInterface
  ...FragmentNodeStanfordCourseTeaser
  ...FragmentNodeStanfordEventTeaser
  ...FragmentNodeStanfordEventSeriesTeaser
  ...FragmentNodeStanfordNewsTeaser
  ...FragmentNodeStanfordPageTeaser
  ...FragmentNodeStanfordPersonTeaser
  ...FragmentNodeStanfordPolicyTeaser
  ...FragmentNodeStanfordPublicationTeaser
}
    ${FragmentNodeSupBookTeaserFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordCourseTeaserFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentNodeStanfordEventSeriesTeaserFragmentDoc}
${FragmentNodeStanfordNewsTeaserFragmentDoc}
${FragmentNodeStanfordPageTeaserFragmentDoc}
${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentNodeStanfordPolicyTeaserFragmentDoc}
${FragmentNodeStanfordPublicationTeaserFragmentDoc}`;
export const FragmentMenuLinkFragmentDoc = gql`
    fragment FragmentMenuLink on MenuItem {
  url
  title
  id
  expanded
}
    `;
export const FragmentViewPageInfoFragmentDoc = gql`
    fragment FragmentViewPageInfo on ViewPageInfo {
  page
  total
}
    `;
export const NodeDocument = gql`
    query Node($uuid: ID!) {
  node(id: $uuid) {
    ...FragmentNodeUnion
  }
}
    ${FragmentNodeUnionFragmentDoc}`;
export const AllNodesDocument = gql`
    query AllNodes($first: Int = 1000, $nodeSupBooks: Cursor, $nodeStanfordCourses: Cursor, $nodeStanfordEventSeriesItems: Cursor, $nodeStanfordEvents: Cursor, $nodeStanfordNewsItems: Cursor, $nodeStanfordPages: Cursor, $nodeStanfordPeople: Cursor, $nodeStanfordPolicies: Cursor, $nodeStanfordPublications: Cursor) {
  nodeStanfordCourses(
    first: $first
    after: $nodeStanfordCourses
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordEventSeriesItems(
    first: $first
    after: $nodeStanfordEventSeriesItems
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordEvents(
    first: $first
    after: $nodeStanfordEvents
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordNewsItems(
    first: $first
    after: $nodeStanfordNewsItems
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordPages(first: $first, after: $nodeStanfordPages, sortKey: CREATED_AT) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordPeople(
    first: $first
    after: $nodeStanfordPeople
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordPolicies(
    first: $first
    after: $nodeStanfordPolicies
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeStanfordPublications(
    first: $first
    after: $nodeStanfordPublications
    sortKey: CREATED_AT
  ) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
  nodeSupBooks(first: $first, after: $nodeSupBooks, sortKey: CREATED_AT) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${AllNodeInterfaceFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const BooksDocument = gql`
    query Books($first: Int = 1000, $after: Cursor) {
  nodeSupBooks(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeInterface
      supBookAuthors {
        ...FragmentNameType
      }
      supBookWorkIdNumber
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNameTypeFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const CoursesDocument = gql`
    query Courses($first: Int = 1000, $after: Cursor) {
  nodeStanfordCourses(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordCourse
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordCourseFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const EventSeriesDocument = gql`
    query EventSeries($first: Int = 1000, $after: Cursor) {
  nodeStanfordEventSeriesItems(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordEventSeries
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordEventSeriesFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const EventsDocument = gql`
    query Events($first: Int = 1000, $after: Cursor) {
  nodeStanfordEvents(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordEvent
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordEventFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const NewsDocument = gql`
    query News($first: Int = 1000, $after: Cursor) {
  nodeStanfordNewsItems(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordNews
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordNewsFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const BasicPagesDocument = gql`
    query BasicPages($first: Int = 1000, $after: Cursor) {
  nodeStanfordPages(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordPage
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordPageFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const PeopleDocument = gql`
    query People($first: Int = 1000, $after: Cursor) {
  nodeStanfordPeople(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordPerson
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordPersonFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const PoliciesDocument = gql`
    query Policies($first: Int = 1000, $after: Cursor) {
  nodeStanfordPolicies(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordPolicy
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordPolicyFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const PublicationsDocument = gql`
    query Publications($first: Int = 1000, $after: Cursor) {
  nodeStanfordPublications(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      ...FragmentNodeStanfordPublication
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNodeStanfordPublicationFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const MediaDocument = gql`
    query Media($uuid: ID!) {
  media(id: $uuid) {
    ...FragmentMediaUnion
  }
}
    ${FragmentMediaUnionFragmentDoc}`;
export const TermDocument = gql`
    query Term($uuid: ID!) {
  term(id: $uuid) {
    ...FragmentTermInterface
  }
}
    ${FragmentTermInterfaceFragmentDoc}`;
export const ParagraphDocument = gql`
    query Paragraph($uuid: ID!) {
  paragraph(id: $uuid) {
    ...FragmentParagraphUnion
  }
}
    ${FragmentParagraphUnionFragmentDoc}`;
export const ConfigPagesDocument = gql`
    query ConfigPages {
  stanfordBasicSiteSettings(first: 1) {
    nodes {
      __typename
      suGoogleAnalytics
      suSiteAlgolia
      suSiteAlgoliaId
      suSiteAlgoliaIndex
      suSiteAlgoliaSearch
      suSiteDropdowns
      suSiteMenuLevels
      suSiteName
      suSiteNobots
    }
  }
  stanfordGlobalMessages(first: 1) {
    nodes {
      __typename
      id
      suGlobalMsgEnabled
      suGlobalMsgHeader
      suGlobalMsgLabel
      suGlobalMsgLink {
        title
        url
      }
      suGlobalMsgMessage {
        processed
      }
      suGlobalMsgType
    }
  }
  stanfordLocalFooters(first: 1) {
    nodes {
      __typename
      suFooterEnabled
      suLocalFootAction {
        title
        url
      }
      suLocalFootAddress {
        additionalName
        addressLine1
        addressLine2
        administrativeArea
        country {
          code
          name
        }
        dependentLocality
        familyName
        givenName
        langcode
        locality
        organization
        postalCode
        sortingCode
      }
      suLocalFootFButton
      suLocalFootFIntro {
        processed
      }
      suLocalFootFMethod
      suLocalFootFUrl {
        url
        title
      }
      suLocalFootLine1
      suLocalFootLine4
      suLocalFootLine2
      suLocalFootLine3
      suLocalFootLine5
      suLocalFootLocImg {
        alt
        height
        url
        width
      }
      suLocalFootLocLink {
        title
        url
      }
      suLocalFootLocOp
      suLocalFootPrCo {
        processed
      }
      suLocalFootPrimary {
        title
        url
      }
      suLocalFootPrimeH
      suLocalFootSeCo {
        processed
      }
      suLocalFootSecond {
        title
        url
      }
      suLocalFootSecondH
      suLocalFootSocial {
        title
        url
      }
      suLocalFootSunetT
      suLocalFootTr2Co {
        processed
      }
      suLocalFootTrCo {
        processed
      }
      suLocalFootUseLoc
      suLocalFootUseLogo
    }
  }
  stanfordSuperFooters(first: 1) {
    nodes {
      __typename
      suSuperFootEnabled
      suSuperFootIntranet {
        title
        url
      }
      suSuperFootLink {
        title
        url
      }
      suSuperFootText {
        processed
      }
      suSuperFootTitle
    }
  }
  lockupSettings(first: 1) {
    nodes {
      __typename
      suLine1
      suLine2
      suLine3
      suLine4
      suLine5
      suLockupEnabled
      suLockupOptions
      suUploadLogoImage {
        alt
        height
        url
        width
      }
      suUseThemeLogo
    }
  }
}
    `;
export const MenuDocument = gql`
    query Menu($name: MenuAvailable = MAIN) {
  menu(name: $name) {
    items {
      ...FragmentMenuLink
      children {
        ...FragmentMenuLink
        children {
          ...FragmentMenuLink
          children {
            ...FragmentMenuLink
            children {
              ...FragmentMenuLink
            }
          }
        }
      }
    }
  }
}
    ${FragmentMenuLinkFragmentDoc}`;
export const RouteDocument = gql`
    query Route($path: String!) {
  route(path: $path) {
    __typename
    ... on RouteRedirect {
      url
      internal
      status
      redirect
    }
    ... on RouteInternal {
      entity {
        ...FragmentNodeUnion
        ...FragmentTermInterface
      }
    }
  }
}
    ${FragmentNodeUnionFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const RedirectsDocument = gql`
    query Redirects($first: Int = 1000, $after: Cursor) {
  redirects(first: $first, after: $after) {
    redirects: nodes {
      id
      redirectSource {
        url
      }
      redirectRedirect {
        url
      }
      statusCode
    }
    pageInfo {
      endCursor
    }
  }
}
    `;
export const StanfordBasicPagesDocument = gql`
    query stanfordBasicPages($filters: StanfordBasicPagesContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordBasicPages(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordPageTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordPageTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordBasicPagesCardsDocument = gql`
    query stanfordBasicPagesCards($filters: StanfordBasicPagesCardsContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordBasicPagesCards(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordPageTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordPageTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordCoursesDocument = gql`
    query stanfordCourses($filters: StanfordCoursesContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordCourses(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordCourse
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordCourseFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordCoursesCardGridDocument = gql`
    query stanfordCoursesCardGrid($filters: StanfordCoursesCardGridContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordCoursesCardGrid(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordCourse
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordCourseFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordEventsCardGridDocument = gql`
    query stanfordEventsCardGrid($filters: StanfordEventsCardGridContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordEventsCardGrid(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordEventTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordEventsDocument = gql`
    query stanfordEvents($filters: StanfordEventsContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordEvents(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordEventTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordEventsPastEventsDocument = gql`
    query stanfordEventsPastEvents($filters: StanfordEventsPastEventsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordEventsPastEvents(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordEventTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordNewsDefaultListDocument = gql`
    query stanfordNewsDefaultList($filters: StanfordNewsDefaultListContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordNewsDefaultList(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordNewsTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordNewsTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordNewsCardGridDocument = gql`
    query stanfordNewsCardGrid($filters: StanfordNewsCardGridContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordNewsCardGrid(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordNewsTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordNewsTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordPersonDocument = gql`
    query stanfordPerson($filters: StanfordPersonContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordPerson(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordPersonTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordPublicationsApaDocument = gql`
    query stanfordPublicationsApa($filters: StanfordPublicationsApaContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordPublicationsApa(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordPublicationTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordPublicationTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordPublicationsChicagoDocument = gql`
    query stanfordPublicationsChicago($filters: StanfordPublicationsChicagoContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordPublicationsChicago(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeStanfordPublicationTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeStanfordPublicationTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const StanfordSharedTagsDocument = gql`
    query stanfordSharedTags($filters: StanfordSharedTagsContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordSharedTags(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeTeaserUnion
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeTeaserUnionFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const SupBooksDocument = gql`
    query supBooks($filters: SupBooksViewContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  supBooksView(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeSupBookTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeSupBookTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const SupBooksAwardWinnersDocument = gql`
    query supBooksAwardWinners($filters: SupBooksAwardWinnersContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  supBooksAwardWinners(
    contextualFilter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    results {
      ...FragmentNodeSupBookTeaser
    }
    pageInfo {
      ...FragmentViewPageInfo
    }
  }
}
    ${FragmentNodeSupBookTeaserFragmentDoc}
${FragmentViewPageInfoFragmentDoc}`;
export const SupBookAncillaryDocument = gql`
    query supBookAncillary($filters: SupBookAncillaryContextualFilterInput) {
  supBookAncillary(contextualFilter: $filters) {
    results {
      ...FragmentNodeInterface
    }
  }
}
    ${FragmentNodeInterfaceFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Node(variables: DrupalTypes.NodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.NodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NodeQuery>(NodeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Node', 'query', variables);
    },
    AllNodes(variables?: DrupalTypes.AllNodesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.AllNodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.AllNodesQuery>(AllNodesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllNodes', 'query', variables);
    },
    Books(variables?: DrupalTypes.BooksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.BooksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BooksQuery>(BooksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Books', 'query', variables);
    },
    Courses(variables?: DrupalTypes.CoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.CoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.CoursesQuery>(CoursesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Courses', 'query', variables);
    },
    EventSeries(variables?: DrupalTypes.EventSeriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.EventSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventSeriesQuery>(EventSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EventSeries', 'query', variables);
    },
    Events(variables?: DrupalTypes.EventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.EventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventsQuery>(EventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Events', 'query', variables);
    },
    News(variables?: DrupalTypes.NewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.NewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NewsQuery>(NewsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'News', 'query', variables);
    },
    BasicPages(variables?: DrupalTypes.BasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.BasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BasicPagesQuery>(BasicPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BasicPages', 'query', variables);
    },
    People(variables?: DrupalTypes.PeopleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.PeopleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PeopleQuery>(PeopleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'People', 'query', variables);
    },
    Policies(variables?: DrupalTypes.PoliciesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.PoliciesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PoliciesQuery>(PoliciesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Policies', 'query', variables);
    },
    Publications(variables?: DrupalTypes.PublicationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.PublicationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PublicationsQuery>(PublicationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Publications', 'query', variables);
    },
    Media(variables: DrupalTypes.MediaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.MediaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MediaQuery>(MediaDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Media', 'query', variables);
    },
    Term(variables: DrupalTypes.TermQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.TermQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.TermQuery>(TermDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Term', 'query', variables);
    },
    Paragraph(variables: DrupalTypes.ParagraphQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.ParagraphQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ParagraphQuery>(ParagraphDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Paragraph', 'query', variables);
    },
    ConfigPages(variables?: DrupalTypes.ConfigPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.ConfigPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ConfigPagesQuery>(ConfigPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConfigPages', 'query', variables);
    },
    Menu(variables?: DrupalTypes.MenuQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.MenuQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MenuQuery>(MenuDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Menu', 'query', variables);
    },
    Route(variables: DrupalTypes.RouteQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.RouteQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RouteQuery>(RouteDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Route', 'query', variables);
    },
    Redirects(variables?: DrupalTypes.RedirectsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.RedirectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RedirectsQuery>(RedirectsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Redirects', 'query', variables);
    },
    stanfordBasicPages(variables?: DrupalTypes.StanfordBasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordBasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordBasicPagesQuery>(StanfordBasicPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordBasicPages', 'query', variables);
    },
    stanfordBasicPagesCards(variables?: DrupalTypes.StanfordBasicPagesCardsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordBasicPagesCardsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordBasicPagesCardsQuery>(StanfordBasicPagesCardsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordBasicPagesCards', 'query', variables);
    },
    stanfordCourses(variables?: DrupalTypes.StanfordCoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordCoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordCoursesQuery>(StanfordCoursesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordCourses', 'query', variables);
    },
    stanfordCoursesCardGrid(variables?: DrupalTypes.StanfordCoursesCardGridQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordCoursesCardGridQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordCoursesCardGridQuery>(StanfordCoursesCardGridDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordCoursesCardGrid', 'query', variables);
    },
    stanfordEventsCardGrid(variables?: DrupalTypes.StanfordEventsCardGridQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordEventsCardGridQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsCardGridQuery>(StanfordEventsCardGridDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordEventsCardGrid', 'query', variables);
    },
    stanfordEvents(variables?: DrupalTypes.StanfordEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsQuery>(StanfordEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordEvents', 'query', variables);
    },
    stanfordEventsPastEvents(variables?: DrupalTypes.StanfordEventsPastEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordEventsPastEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsPastEventsQuery>(StanfordEventsPastEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordEventsPastEvents', 'query', variables);
    },
    stanfordNewsDefaultList(variables?: DrupalTypes.StanfordNewsDefaultListQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordNewsDefaultListQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordNewsDefaultListQuery>(StanfordNewsDefaultListDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordNewsDefaultList', 'query', variables);
    },
    stanfordNewsCardGrid(variables?: DrupalTypes.StanfordNewsCardGridQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordNewsCardGridQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordNewsCardGridQuery>(StanfordNewsCardGridDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordNewsCardGrid', 'query', variables);
    },
    stanfordPerson(variables?: DrupalTypes.StanfordPersonQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordPersonQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPersonQuery>(StanfordPersonDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordPerson', 'query', variables);
    },
    stanfordPublicationsApa(variables?: DrupalTypes.StanfordPublicationsApaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordPublicationsApaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPublicationsApaQuery>(StanfordPublicationsApaDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordPublicationsApa', 'query', variables);
    },
    stanfordPublicationsChicago(variables?: DrupalTypes.StanfordPublicationsChicagoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordPublicationsChicagoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPublicationsChicagoQuery>(StanfordPublicationsChicagoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordPublicationsChicago', 'query', variables);
    },
    stanfordSharedTags(variables?: DrupalTypes.StanfordSharedTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.StanfordSharedTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordSharedTagsQuery>(StanfordSharedTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stanfordSharedTags', 'query', variables);
    },
    supBooks(variables?: DrupalTypes.SupBooksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.SupBooksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksQuery>(SupBooksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'supBooks', 'query', variables);
    },
    supBooksAwardWinners(variables?: DrupalTypes.SupBooksAwardWinnersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.SupBooksAwardWinnersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksAwardWinnersQuery>(SupBooksAwardWinnersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'supBooksAwardWinners', 'query', variables);
    },
    supBookAncillary(variables?: DrupalTypes.SupBookAncillaryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DrupalTypes.SupBookAncillaryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBookAncillaryQuery>(SupBookAncillaryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'supBookAncillary', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;