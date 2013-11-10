from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel
from iomodels.crmengine.notes import Topic
from model import User
import pprint


class Event(EndpointsModel):
  owner = ndb.StructuredProperty(User)
  created_at = ndb.DateTimeProperty(auto_now_add=True)
  updated_at = ndb.DateTimeProperty(auto_now=True)
  title = ndb.StringProperty(required=True)
  where = ndb.StringProperty()
  starts_at = ndb.DateTimeProperty()
  ends_at = ndb.DateTimeProperty()
  status = ndb.StringProperty(default='open')
  # number of comments in this topic
  comments = ndb.IntegerProperty(default=0)
  # A Topic is attached to an object for example Account or Opportunity..
  about_kind = ndb.StringProperty()
  about_item = ndb.StringProperty()
  # a key reference to the account's organization
  # Should be required
  organization = ndb.KeyProperty()


  