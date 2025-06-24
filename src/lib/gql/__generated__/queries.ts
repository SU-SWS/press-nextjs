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
export const FragmentNodeInterfaceFragmentDoc = gql`
    fragment FragmentNodeInterface on NodeInterface {
  __typename
  id
  title
  path
}
    `;
export const FragmentMetaTagFragmentDoc = gql`
    fragment FragmentMetaTag on MetaTagUnion {
  ... on MetaTagValue {
    __typename
    tag
    attributes {
      name
      content
    }
  }
  ... on MetaTagProperty {
    __typename
    tag
    attributes {
      property
      content
    }
  }
}
    `;
export const FragmentNodePageFragmentDoc = gql`
    fragment FragmentNodePage on NodeInterface {
  ...FragmentNodeInterface
  status
  metatag {
    ...FragmentMetaTag
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMetaTagFragmentDoc}`;
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
export const FragmentAwardFragmentDoc = gql`
    fragment FragmentAward on PressAward {
  id
  title
  supAssociation
  supDescription {
    processed
  }
  supPlace
  supRank
  supYear
}
    `;
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
export const FragmentDateTimeFragmentDoc = gql`
    fragment FragmentDateTime on DateTime {
  timezone
  time
}
    `;
export const FragmentLinkFragmentDoc = gql`
    fragment FragmentLink on Link {
  title
  url
}
    `;
export const FragmentNodeSupBookFragmentDoc = gql`
    fragment FragmentNodeSupBook on NodeSupBook {
  supBookAuthorInfo {
    processed
  }
  supBookAuthors {
    ...FragmentNameType
  }
  supBookAuthorsFull
  supBookAvailDesc
  supBookAwards {
    ...FragmentAward
  }
  supBookCatalogSeasonYyyy
  supBookPublisher
  supBookCopublisherName
  body {
    processed
  }
  supBookDigitalCompLink
  supBookImage {
    ...FragmentMediaImage
  }
  supBookImprint {
    ...FragmentTermInterface
  }
  supBookIsbn13Alt
  supBookIsbn13Cloth
  supBookIsbn13Digital
  supBookIsbn13Isw
  supBookIsbn13Paper
  supBookPages
  supBookPrintDeskCopies
  supBookPubDateCloth {
    ...FragmentDateTime
  }
  supBookPubDateFirst {
    ...FragmentDateTime
  }
  supBookPubYearFirst
  supBookRelatedTitles {
    ...FragmentNodeInterface
  }
  supBookReviews {
    processed
  }
  supBookSalesRank
  supBookSeries {
    ...FragmentTermInterface
    supSeriesPage {
      url
    }
  }
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
  supBookUrlIsw
  supBookWorkIdNumber
  supBookERetailers {
    ...FragmentLink
  }
  supBookType
  supBookNoCart
  supBookPriceData {
    id
    ... on PressPrice {
      supIntlCart
    }
  }
  supBookEpubFormat
  supBookPdfFormat
}
    ${FragmentNameTypeFragmentDoc}
${FragmentAwardFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentDateTimeFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentLinkFragmentDoc}`;
export const FragmentNodeStanfordCourseFragmentDoc = gql`
    fragment FragmentNodeStanfordCourse on NodeStanfordCourse {
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
    ${FragmentTermInterfaceFragmentDoc}`;
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
export const FragmentParagraphSupCarouselSlideFragmentDoc = gql`
    fragment FragmentParagraphSupCarouselSlide on ParagraphSupCarouselSlide {
  ...FragmentParagraphInterface
  supSlideBody {
    processed
  }
  supSlideButton {
    ...FragmentLink
  }
  supSlideColor
  supSlideEyebrow
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
${FragmentLinkFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
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
export const FragmentParagraphStanfordFaqFragmentDoc = gql`
    fragment FragmentParagraphStanfordFaq on ParagraphStanfordFaq {
  ...FragmentParagraphInterface
  suFaqHeadline
  suFaqDescription {
    processed
  }
  suFaqQuestions {
    ...FragmentParagraphStanfordAccordion
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordAccordionFragmentDoc}`;
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
  ...FragmentParagraphStanfordFaq
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
${FragmentParagraphSupBlogTeaserFragmentDoc}
${FragmentParagraphStanfordFaqFragmentDoc}`;
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
    ${FragmentParagraphUnionFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordNewsFragmentDoc = gql`
    fragment FragmentNodeStanfordNews on NodeStanfordNews {
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
    ${FragmentTermInterfaceFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordPageTitleBannerFragmentDoc}
${FragmentParagraphSupCarouselFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentNodeStanfordPersonFragmentDoc = gql`
    fragment FragmentNodeStanfordPerson on NodeStanfordPerson {
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
    ${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeSupBookAncillaryFragmentDoc = gql`
    fragment FragmentNodeSupBookAncillary on NodeSupBookAncillary {
  body {
    processed
  }
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
  ...FragmentNodePage
  ...FragmentNodeSupBook
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
    ${FragmentNodePageFragmentDoc}
${FragmentNodeSupBookFragmentDoc}
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
    id
  }
  supBookSubtitle
  supBookWorkIdNumber
  supBookAuthorsFull
  supBookType
  supBookImage {
    ...FragmentMediaImage
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNameTypeFragmentDoc}
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
    ...FragmentParagraphStanfordPageTitleBanner
    ...FragmentParagraphSupCarousel
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordPageTitleBannerFragmentDoc}
${FragmentParagraphSupCarouselFragmentDoc}`;
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
  nodeStanfordPages(first: $first, after: $nodeStanfordPages, sortKey: CREATED_AT) {
    nodes {
      ...AllNodeInterface
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
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
export const BooksAuthorsDocument = gql`
    query BooksAuthors($first: Int = 1000, $after: Cursor) {
  nodeSupBooks(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      id
      title
      path
      supBookSubtitle
      supBookAuthors {
        ...FragmentNameType
      }
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
    ${FragmentNameTypeFragmentDoc}
${FragmentPageInfoFragmentDoc}`;
export const BooksWorkIdDocument = gql`
    query BooksWorkId($first: Int = 1000, $after: Cursor) {
  nodeSupBooks(first: $first, after: $after, sortKey: CREATED_AT) {
    nodes {
      path
      supBookWorkIdNumber
    }
    pageInfo {
      ...FragmentPageInfo
    }
  }
}
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
export const BookPriceDocument = gql`
    query BookPrice($id: ID!) {
  press(id: $id) {
    __typename
    ... on PressPrice {
      id
      supClothDiscount
      supClothPrice
      supClothSale
      supComingSoon
      supDigitalPrice
      supDigitalSale
      supDigitalDiscount
      supIntlCart
      supPaperDiscount
      supPaperPrice
      supPaperSale
      supPreorder
      workId
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
    query Route($path: String!, $teaser: Boolean = false) {
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
        ...FragmentNodeUnion @skip(if: $teaser)
        ...FragmentNodeTeaserUnion @include(if: $teaser)
      }
    }
  }
}
    ${FragmentNodeUnionFragmentDoc}
${FragmentNodeTeaserUnionFragmentDoc}`;
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
    query stanfordBasicPages($contextualFilters: StanfordBasicPagesContextualFilterInput, $sortKey: StanfordBasicPagesSortKeys, $sortDir: SortDirection, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordBasicPages(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: $sortKey
    sortDir: $sortDir
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
    query stanfordCourses($contextualFilters: StanfordCoursesContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordCourses(
    contextualFilter: $contextualFilters
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
export const StanfordEventsDocument = gql`
    query stanfordEvents($contextualFilters: StanfordEventsContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordEvents(
    contextualFilter: $contextualFilters
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
    query stanfordEventsPastEvents($contextualFilters: StanfordEventsPastEventsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordEventsPastEvents(
    contextualFilter: $contextualFilters
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
export const StanfordNewsDocument = gql`
    query stanfordNews($contextualFilters: StanfordNewsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordNews(
    contextualFilter: $contextualFilters
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
    query stanfordPerson($contextualFilters: StanfordPersonContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordPerson(
    contextualFilter: $contextualFilters
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
export const StanfordPublicationsDocument = gql`
    query stanfordPublications($contextualFilters: StanfordPublicationsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordPublications(
    contextualFilter: $contextualFilters
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
    query stanfordSharedTags($contextualFilters: StanfordSharedTagsContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordSharedTags(
    contextualFilter: $contextualFilters
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
    query supBooks($contextualFilters: SupBooksViewContextualFilterInput, $filters: SupBooksViewFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int, $sortKey: SupBooksViewSortKeys) {
  supBooksView(
    contextualFilter: $contextualFilters
    filter: $filters
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: $sortKey
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
    query supBooksAwardWinners($contextualFilters: SupBooksAwardWinnersContextualFilterInput, $filters: SupBooksAwardWinnersFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  supBooksAwardWinners(
    contextualFilter: $contextualFilters
    filter: $filters
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
    query supBookAncillary($contextualFilters: SupBookAncillaryContextualFilterInput) {
  supBookAncillary(contextualFilter: $contextualFilters) {
    results {
      ... on NodeInterface {
        id
        path
        title
      }
    }
  }
}
    `;
export const SupBooksBestSellersDocument = gql`
    query supBooksBestSellers($pageSize: Int = 3, $page: Int, $offset: Int) {
  supBooksBestSellers(pageSize: $pageSize, page: $page, offset: $offset) {
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
export const SupBooksNewReleasesDocument = gql`
    query supBooksNewReleases($pageSize: Int = 3, $page: Int, $offset: Int) {
  supBooksNewReleases(pageSize: $pageSize, page: $page, offset: $offset) {
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Node(variables: DrupalTypes.NodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.NodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NodeQuery>({ document: NodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Node', 'query', variables);
    },
    AllNodes(variables?: DrupalTypes.AllNodesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.AllNodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.AllNodesQuery>({ document: AllNodesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllNodes', 'query', variables);
    },
    BooksAuthors(variables?: DrupalTypes.BooksAuthorsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.BooksAuthorsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BooksAuthorsQuery>({ document: BooksAuthorsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BooksAuthors', 'query', variables);
    },
    BooksWorkId(variables?: DrupalTypes.BooksWorkIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.BooksWorkIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BooksWorkIdQuery>({ document: BooksWorkIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BooksWorkId', 'query', variables);
    },
    Courses(variables?: DrupalTypes.CoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.CoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.CoursesQuery>({ document: CoursesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Courses', 'query', variables);
    },
    EventSeries(variables?: DrupalTypes.EventSeriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.EventSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventSeriesQuery>({ document: EventSeriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'EventSeries', 'query', variables);
    },
    Events(variables?: DrupalTypes.EventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.EventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventsQuery>({ document: EventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Events', 'query', variables);
    },
    News(variables?: DrupalTypes.NewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.NewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NewsQuery>({ document: NewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'News', 'query', variables);
    },
    BasicPages(variables?: DrupalTypes.BasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.BasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BasicPagesQuery>({ document: BasicPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BasicPages', 'query', variables);
    },
    People(variables?: DrupalTypes.PeopleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PeopleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PeopleQuery>({ document: PeopleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'People', 'query', variables);
    },
    Policies(variables?: DrupalTypes.PoliciesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PoliciesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PoliciesQuery>({ document: PoliciesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Policies', 'query', variables);
    },
    Publications(variables?: DrupalTypes.PublicationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PublicationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PublicationsQuery>({ document: PublicationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Publications', 'query', variables);
    },
    Media(variables: DrupalTypes.MediaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.MediaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MediaQuery>({ document: MediaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Media', 'query', variables);
    },
    Term(variables: DrupalTypes.TermQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.TermQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.TermQuery>({ document: TermDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Term', 'query', variables);
    },
    Paragraph(variables: DrupalTypes.ParagraphQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.ParagraphQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ParagraphQuery>({ document: ParagraphDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Paragraph', 'query', variables);
    },
    ConfigPages(variables?: DrupalTypes.ConfigPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.ConfigPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ConfigPagesQuery>({ document: ConfigPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ConfigPages', 'query', variables);
    },
    BookPrice(variables: DrupalTypes.BookPriceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.BookPriceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BookPriceQuery>({ document: BookPriceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BookPrice', 'query', variables);
    },
    Menu(variables?: DrupalTypes.MenuQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.MenuQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MenuQuery>({ document: MenuDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Menu', 'query', variables);
    },
    Route(variables: DrupalTypes.RouteQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.RouteQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RouteQuery>({ document: RouteDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Route', 'query', variables);
    },
    Redirects(variables?: DrupalTypes.RedirectsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.RedirectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RedirectsQuery>({ document: RedirectsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Redirects', 'query', variables);
    },
    stanfordBasicPages(variables?: DrupalTypes.StanfordBasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordBasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordBasicPagesQuery>({ document: StanfordBasicPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordBasicPages', 'query', variables);
    },
    stanfordCourses(variables?: DrupalTypes.StanfordCoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordCoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordCoursesQuery>({ document: StanfordCoursesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordCourses', 'query', variables);
    },
    stanfordEvents(variables?: DrupalTypes.StanfordEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsQuery>({ document: StanfordEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordEvents', 'query', variables);
    },
    stanfordEventsPastEvents(variables?: DrupalTypes.StanfordEventsPastEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordEventsPastEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsPastEventsQuery>({ document: StanfordEventsPastEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordEventsPastEvents', 'query', variables);
    },
    stanfordNews(variables?: DrupalTypes.StanfordNewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordNewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordNewsQuery>({ document: StanfordNewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordNews', 'query', variables);
    },
    stanfordPerson(variables?: DrupalTypes.StanfordPersonQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordPersonQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPersonQuery>({ document: StanfordPersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordPerson', 'query', variables);
    },
    stanfordPublications(variables?: DrupalTypes.StanfordPublicationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordPublicationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPublicationsQuery>({ document: StanfordPublicationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordPublications', 'query', variables);
    },
    stanfordSharedTags(variables?: DrupalTypes.StanfordSharedTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordSharedTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordSharedTagsQuery>({ document: StanfordSharedTagsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordSharedTags', 'query', variables);
    },
    supBooks(variables?: DrupalTypes.SupBooksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SupBooksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksQuery>({ document: SupBooksDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'supBooks', 'query', variables);
    },
    supBooksAwardWinners(variables?: DrupalTypes.SupBooksAwardWinnersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SupBooksAwardWinnersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksAwardWinnersQuery>({ document: SupBooksAwardWinnersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'supBooksAwardWinners', 'query', variables);
    },
    supBookAncillary(variables?: DrupalTypes.SupBookAncillaryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SupBookAncillaryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBookAncillaryQuery>({ document: SupBookAncillaryDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'supBookAncillary', 'query', variables);
    },
    supBooksBestSellers(variables?: DrupalTypes.SupBooksBestSellersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SupBooksBestSellersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksBestSellersQuery>({ document: SupBooksBestSellersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'supBooksBestSellers', 'query', variables);
    },
    supBooksNewReleases(variables?: DrupalTypes.SupBooksNewReleasesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SupBooksNewReleasesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SupBooksNewReleasesQuery>({ document: SupBooksNewReleasesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'supBooksNewReleases', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;